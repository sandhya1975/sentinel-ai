# SESSION MEMORY RULE

Before giving any build instructions, read PROJECT-BRAIN.md first.

PROJECT-BRAIN.md is the source of truth for:
- current sprint
- completed systems
- architecture state
- governance modules
- active roadmap

Never restart SENTINEL from scratch.
Never rebuild already-working systems.
Always continue from latest project state.mprise the SENTINEL governance ecosystem. Each agent is designed with specific capabilities and operates within defined boundaries to ensure safe and effective AI decision-making.

## Core Agents

### Sentinel Core Agent

**Purpose**: Central governance and evaluation engine
**Responsibilities**:
- Decision risk assessment
- GREEN/AMBER/RED classification
- Audit trail generation
- Compliance verification

**Key Capabilities**:
- Multi-modal input processing
- Real-time decision analysis
- Confidence scoring
- Escalation protocols

### Recruiter Evaluation Agent

**Purpose**: Specialized agent for talent acquisition workflows
**Responsibilities**:
- Candidate profile analysis
- Job requirement matching
- Cultural fit assessment
- Bias detection and mitigation

**Key Capabilities**:
- Resume parsing and analysis
- Skills gap identification
- Interview question generation
- Diversity and inclusion monitoring

### Trust Score Agent

**Purpose**: Dynamic reputation and confidence assessment
**Responsibilities**:
- Agent performance tracking
- Decision accuracy measurement
- Trust score calculation
- Performance degradation detection

**Key Capabilities**:
- Historical performance analysis
- Statistical confidence modeling
- Anomaly detection
- Adaptive scoring algorithms

### Chain-of-Custody Agent

**Purpose**: Audit trail and provenance tracking
**Responsibilities**:
- Decision lineage recording
- Data source verification
- Timestamp authentication
- Integrity validation

**Key Capabilities**:
- Cryptographic hashing
- Immutable ledger maintenance
- Cross-reference validation
- Compliance reporting

### Self-Correction Agent

**Purpose**: Continuous learning and improvement
**Responsibilities**:
- Error pattern identification
- Model retraining triggers
- Performance optimization
- Feedback loop management

**Key Capabilities**:
- Root cause analysis
- Automated testing
- Parameter tuning
- Knowledge base updates

## Agent Communication Protocol

All agents communicate through a standardized protocol:

```typescript
interface AgentMessage {
  id: string;
  timestamp: Date;
  sender: AgentId;
  recipient: AgentId;
  type: MessageType;
  payload: any;
  governance: GovernanceLevel;
}
```

### Message Types

- `EVALUATION_REQUEST`: Request for decision assessment
- `TRUST_UPDATE`: Trust score modification
- `AUDIT_LOG`: Chain-of-custody entry
- `CORRECTION_TRIGGER`: Self-improvement signal
- `STATUS_REPORT`: Agent health and performance

## Agent Lifecycle

1. **Initialization**: Agent loads configuration and establishes connections
2. **Registration**: Agent registers with Sentinel Core
3. **Operation**: Agent processes requests and generates responses
4. **Evaluation**: All outputs pass through governance protocol
5. **Decommission**: Graceful shutdown with state preservation

## Safety Mechanisms

- **Input Validation**: All inputs sanitized and validated
- **Rate Limiting**: Prevents resource exhaustion
- **Circuit Breakers**: Automatic failure isolation
- **Fallback Protocols**: Graceful degradation strategies
- **Human Oversight**: AMBER/RED decisions require human review

## Performance Metrics

Agents are monitored for:

- Response time
- Accuracy rate
- Error frequency
- Resource utilization
- Governance compliance

## Development Guidelines

When creating new agents:

1. Follow the established interface contracts
2. Implement comprehensive error handling
3. Include detailed logging and telemetry
4. Support configuration-driven behavior
5. Maintain backward compatibility
6. Document all public methods and behaviors</content>
<parameter name="filePath">/Users/babukunadian/Desktop/sentinel-ai/AGENTS.md