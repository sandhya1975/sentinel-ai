import { chromium, Browser, Page, BrowserContext } from 'playwright';
import axios, { AxiosInstance } from 'axios';
import * as winston from 'winston';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface AgentConfig {
  sentinelApiUrl: string;
  sentinelApiKey: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  timeout: number;
  logLevel: string;
}

interface GovernanceRequest {
  action: string;
  parameters: any;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  requires_approval: boolean;
  agent_id: string;
  session_id?: string;
}

interface GovernanceResponse {
  status: 'GREEN' | 'AMBER' | 'RED';
  decision_id: string;
  reasoning: string[];
  approved: boolean;
  confidence_score: number;
}

interface ActionRequest {
  action: string;
  url?: string;
  selectors?: string[];
  text?: string;
  waitFor?: string;
  timeout?: number;
  governance: Omit<GovernanceRequest, 'action' | 'parameters'>;
}

interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  governance_decision: GovernanceResponse;
  execution_time_ms: number;
  screenshot?: string;
}

interface ActionLog {
  timestamp: Date;
  action: string;
  governance_decision: string;
  success: boolean;
  execution_time_ms: number;
  error?: string;
}

export class PlaywrightAgent {
  private config: AgentConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private httpClient: AxiosInstance;
  private logger: winston.Logger;

  constructor(config?: Partial<AgentConfig>) {
    this.config = {
      sentinelApiUrl: process.env.SENTINEL_API_URL || 'http://localhost:3000/api',
      sentinelApiKey: process.env.SENTINEL_API_KEY || '',
      browser: (process.env.BROWSER as any) || 'chromium',
      headless: process.env.HEADLESS === 'true',
      timeout: parseInt(process.env.TIMEOUT || '30000'),
      logLevel: process.env.LOG_LEVEL || 'info',
      ...config
    };

    this.httpClient = axios.create({
      baseURL: this.config.sentinelApiUrl,
      headers: {
        'Authorization': `Bearer ${this.config.sentinelApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    this.logger = winston.createLogger({
      level: this.config.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/agent.log' })
      ]
    });
  }

  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Playwright Agent');

      this.browser = await chromium.launch({
        headless: this.config.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 }
      });

      this.page = await this.context.newPage();
      this.page.setDefaultTimeout(this.config.timeout);

      this.logger.info('Playwright Agent initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Playwright Agent', { error: error.message });
      throw error;
    }
  }

  async execute(request: ActionRequest): Promise<ActionResult> {
    const startTime = Date.now();

    try {
      this.logger.info('Executing action', { action: request.action });

      // Validate request
      this.validateRequest(request);

      // Request governance approval
      const governanceResponse = await this.requestGovernanceApproval({
        ...request.governance,
        action: request.action,
        parameters: request
      });

      // Log governance decision
      this.logAction({
        timestamp: new Date(),
        action: request.action,
        governance_decision: governanceResponse.status,
        success: false, // Will be updated
        execution_time_ms: 0
      });

      // Check if action is approved
      if (!governanceResponse.approved) {
        throw new Error(`Action blocked by governance: ${governanceResponse.reasoning.join(', ')}`);
      }

      // Execute the action
      const result = await this.performAction(request);

      const executionTime = Date.now() - startTime;

      // Log successful execution
      this.logAction({
        timestamp: new Date(),
        action: request.action,
        governance_decision: governanceResponse.status,
        success: true,
        execution_time_ms: executionTime
      });

      this.logger.info('Action executed successfully', {
        action: request.action,
        execution_time_ms: executionTime
      });

      return {
        success: true,
        data: result,
        governance_decision: governanceResponse,
        execution_time_ms: executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;

      this.logger.error('Action execution failed', {
        action: request.action,
        error: error.message,
        execution_time_ms: executionTime
      });

      // Log failed execution
      this.logAction({
        timestamp: new Date(),
        action: request.action,
        governance_decision: 'UNKNOWN',
        success: false,
        execution_time_ms: executionTime,
        error: error.message
      });

      return {
        success: false,
        error: error.message,
        governance_decision: null,
        execution_time_ms: executionTime
      };
    }
  }

  private async requestGovernanceApproval(request: GovernanceRequest): Promise<GovernanceResponse> {
    try {
      this.logger.debug('Requesting governance approval', { action: request.action });

      const response = await this.httpClient.post('/governance/evaluate', request);

      const governanceResponse: GovernanceResponse = response.data;

      this.logger.info('Governance decision received', {
        status: governanceResponse.status,
        decision_id: governanceResponse.decision_id,
        approved: governanceResponse.approved
      });

      return governanceResponse;
    } catch (error) {
      this.logger.error('Governance request failed', { error: error.message });
      throw new Error(`Governance evaluation failed: ${error.message}`);
    }
  }

  private async performAction(request: ActionRequest): Promise<any> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    switch (request.action) {
      case 'navigate':
        return await this.navigate(request.url!);

      case 'click':
        return await this.click(request.selectors![0]);

      case 'type':
        return await this.typeText(request.selectors![0], request.text!);

      case 'extract':
        return await this.extractData(request.selectors!);

      case 'screenshot':
        return await this.takeScreenshot();

      case 'wait':
        return await this.waitForElement(request.waitFor!);

      default:
        throw new Error(`Unsupported action: ${request.action}`);
    }
  }

  private async navigate(url: string): Promise<void> {
    await this.page!.goto(url, { waitUntil: 'networkidle' });
  }

  private async click(selector: string): Promise<void> {
    await this.page!.click(selector);
  }

  private async typeText(selector: string, text: string): Promise<void> {
    await this.page!.fill(selector, text);
  }

  private async extractData(selectors: string[]): Promise<any> {
    const results = {};

    for (const selector of selectors) {
      try {
        const elements = await this.page!.locator(selector).all();
        results[selector] = await Promise.all(
          elements.map(async (element) => await element.textContent())
        );
      } catch (error) {
        results[selector] = null;
      }
    }

    return results;
  }

  private async takeScreenshot(): Promise<string> {
    const buffer = await this.page!.screenshot({ type: 'png' });
    return buffer.toString('base64');
  }

  private async waitForElement(selector: string): Promise<void> {
    await this.page!.waitForSelector(selector);
  }

  private validateRequest(request: ActionRequest): void {
    const schema = Joi.object({
      action: Joi.string().valid('navigate', 'click', 'type', 'extract', 'screenshot', 'wait').required(),
      url: Joi.string().uri().when('action', { is: 'navigate', then: Joi.required() }),
      selectors: Joi.array().items(Joi.string()).when('action', {
        is: Joi.valid('click', 'type', 'extract'),
        then: Joi.required()
      }),
      text: Joi.string().when('action', { is: 'type', then: Joi.required() }),
      waitFor: Joi.string().when('action', { is: 'wait', then: Joi.required() }),
      governance: Joi.object({
        impact_level: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
        requires_approval: Joi.boolean().required(),
        agent_id: Joi.string().required(),
        session_id: Joi.string().optional()
      }).required()
    });

    const { error } = schema.validate(request);
    if (error) {
      throw new Error(`Invalid request: ${error.details[0].message}`);
    }
  }

  private logAction(log: ActionLog): void {
    this.logger.info('Action logged', log);
    // In a real implementation, this would send to a centralized logging system
  }

  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }

      this.logger.info('Playwright Agent cleaned up successfully');
    } catch (error) {
      this.logger.error('Cleanup failed', { error: error.message });
    }
  }
}

// Example usage
async function main() {
  const agent = new PlaywrightAgent();

  try {
    await agent.initialize();

    const result = await agent.execute({
      action: 'navigate',
      url: 'https://example.com',
      governance: {
        impact_level: 'low',
        requires_approval: true,
        agent_id: 'playwright-agent-001'
      }
    });

    console.log('Execution result:', result);
  } finally {
    await agent.cleanup();
  }
}

// Export for use as module
export default PlaywrightAgent;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}