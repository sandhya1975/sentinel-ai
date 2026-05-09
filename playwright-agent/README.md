# SENTINEL Playwright Agent

A specialized Playwright automation agent for the SENTINEL AI governance system, designed to execute web-based tasks with full governance oversight.

## Overview

The Playwright Agent serves as the automation interface for SENTINEL AI, enabling safe and controlled execution of web-based workflows. All actions are subject to governance evaluation before execution, ensuring compliance and safety.

## Features

- **Governance-First**: All actions require GREEN/AMBER/RED approval
- **Multi-Browser Support**: Chrome, Firefox, Safari, and Edge
- **Headless Operation**: Optimized for server environments
- **Audit Trail**: Complete logging of all automation actions
- **Error Recovery**: Intelligent retry and recovery mechanisms
- **Security Focused**: Isolated execution with minimal privileges

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SENTINEL      │───▶│ Playwright      │───▶│   Target Web    │
│   Governance    │    │   Agent         │    │   Application   │
│   Engine        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       │                       │
         │                       ▼                       ▼
         └───────────────── Audit Trail ─────────────────┘
```

## Installation

```bash
cd playwright-agent
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
# Governance API
SENTINEL_API_URL=http://localhost:3000/api
SENTINEL_API_KEY=your-api-key

# Playwright Configuration
BROWSER=chromium
HEADLESS=true
TIMEOUT=30000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/agent.log
```

## Usage

### Basic Execution

```typescript
import { PlaywrightAgent } from './src/apply-agent';

const agent = new PlaywrightAgent();

await agent.execute({
  action: 'navigate_and_extract',
  url: 'https://example.com',
  selectors: ['.content', '.title'],
  governance: {
    impact_level: 'low',
    requires_approval: true
  }
});
```

### Supported Actions

- **navigate**: Navigate to a URL
- **click**: Click on elements
- **type**: Enter text into form fields
- **extract**: Extract data from page elements
- **screenshot**: Capture page screenshots
- **wait**: Wait for elements or conditions
- **evaluate**: Execute custom JavaScript

## Governance Integration

Every action requires governance approval:

```typescript
interface GovernanceRequest {
  action: string;
  parameters: any;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  requires_approval: boolean;
  agent_id: string;
}

interface GovernanceResponse {
  status: 'GREEN' | 'AMBER' | 'RED';
  decision_id: string;
  reasoning: string[];
  approved: boolean;
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
npm run format
```

## API Reference

### PlaywrightAgent Class

#### Constructor

```typescript
new PlaywrightAgent(config?: AgentConfig)
```

#### Methods

- `execute(action: ActionRequest): Promise<ActionResult>`
- `validateGovernance(decision: GovernanceResponse): boolean`
- `logAction(action: ActionLog): void`
- `cleanup(): Promise<void>`

## Security Considerations

- **Isolated Execution**: Each action runs in a separate browser context
- **Resource Limits**: CPU and memory limits prevent abuse
- **Network Restrictions**: Controlled outbound connections
- **Audit Logging**: All actions are logged with timestamps and context
- **Governance Checks**: No action executes without approval

## Monitoring

The agent provides comprehensive monitoring:

- Action execution times
- Success/failure rates
- Governance approval rates
- Resource utilization
- Error patterns and recovery

## Error Handling

Robust error handling with multiple recovery strategies:

- **Retry Logic**: Automatic retries for transient failures
- **Fallback Actions**: Alternative approaches when primary actions fail
- **Graceful Degradation**: Partial success handling
- **Circuit Breaker**: Automatic shutdown on persistent failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.