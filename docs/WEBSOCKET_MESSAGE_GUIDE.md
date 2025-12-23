# WebSocket Message Guide for C Backend

## Message Structure

All messages sent to the frontend should follow this structure:

```json
{
  "type": "message_type",
  "data": { /* type-specific data */ }
}
```

## Message Types

### 1. `simulation_started`
**When to send:** At the very beginning of simulation
**Purpose:** Initialize the simulation UI
```json
{
  "type": "simulation_started",
  "data": { "timestamp": 0 }
}
```

### 2. `log`
**When to send:** For every event that should appear in the Event Logs panel
**Purpose:** Display human-readable simulation events
```json
{
  "type": "log",
  "data": {
    "timestamp": 604.898,
    "message": "job1 arrives, needs 12 papers, inter-arrival time = 604.898ms"
  }
}
```

### 3. `consumer_update`
**When to send:** When a single consumer's state changes
**Purpose:** Update one consumer's display in ConsumerPool
```json
{
  "type": "consumer_update",
  "data": {
    "id": 1,
    "papersLeft": 88,
    "status": "serving",
    "currentJobId": 1  // Optional: which job is being served
  }
}
```

**Status values:**
- `"serving"` - Consumer actively printing a job (blue, shows job ID)
- `"waiting_refill"` - Consumer waiting for paper refill (red)
- `"idle"` - Consumer available but not serving (gray)

### 4. `consumers_update`
**When to send:** At simulation start or when resetting all consumers
**Purpose:** Set the complete consumer pool state
```json
{
  "type": "consumers_update",
  "data": [
    { "id": 1, "papersLeft": 100, "status": "idle" },
    { "id": 2, "papersLeft": 100, "status": "idle" }
  ]
}
```

### 5. `jobs_update`
**When to send:** When the job queue changes
**Purpose:** Update QueueDisplay with current jobs **waiting in queue** (not being served)
```json
{
  "type": "jobs_update",
  "data": [
    { "id": 3, "pages": 14 },
    { "id": 4, "pages": 15 }
  ]
}
```

**Important:** This should only contain jobs in the queue, NOT jobs currently being served by consumers.

### 6. `stats_update`
**When to send:** Whenever simulation statistics change
**Purpose:** Update SimulationStatsDisplay panel
```json
{
  "type": "stats_update",
  "data": {
    "totalJobsProcessed": 5,
    "activeConsumers": 2,
    "queueLength": 3,
    "avgJobCompletionTime": 2500,
    "failedJobs": 0
  }
}
```

### 7. `simulation_complete`
**When to send:** When simulation ends
**Purpose:** Signal completion and show final duration
```json
{
  "type": "simulation_complete",
  "data": {
    "duration": 38579.115
  }
}
```

## Typical Event Sequences

### Job Arrival → Queue → Service → Completion

```javascript
// 1. Job arrives
{ "type": "log", "data": { "timestamp": 604.898, "message": "job1 arrives, needs 12 papers..." } }
{ "type": "jobs_update", "data": [{ "id": 1, "pages": 12 }] }

// 2. Job enters queue (if needed)
{ "type": "log", "data": { "timestamp": 604.919, "message": "job1 enters queue, queue length = 1" } }
{ "type": "stats_update", "data": { "queueLength": 1, ... } }

// 3. Job leaves queue and starts service
{ "type": "log", "data": { "timestamp": 605.194, "message": "job1 leaves queue..." } }
{ "type": "jobs_update", "data": [] }  // Remove from queue
{ "type": "stats_update", "data": { "queueLength": 0, ... } }

{ "type": "log", "data": { "timestamp": 605.228, "message": "job1 begins service at printer1..." } }
{ "type": "consumer_update", "data": { "id": 1, "papersLeft": 88, "status": "serving", "currentJobId": 1 } }
{ "type": "stats_update", "data": { "activeConsumers": 1, ... } }

// 4. Job completes
{ "type": "log", "data": { "timestamp": 3609.936, "message": "job1 departs from printer1..." } }
{ "type": "consumer_update", "data": { "id": 1, "papersLeft": 88, "status": "idle" } }  // No currentJobId
{ "type": "stats_update", "data": { "totalJobsProcessed": 1, "activeConsumers": 0, ... } }
```

### Paper Refill Sequence

```javascript
// 1. Consumer requests refill
{ "type": "log", "data": { "timestamp": 22881.724, "message": "printer1 does not have enough paper..." } }
{ "type": "consumer_update", "data": { "id": 1, "papersLeft": 11, "status": "waiting_refill" } }

// 2. Refill starts
{ "type": "log", "data": { "timestamp": 22881.806, "message": "printer1 starts refilling 89 papers..." } }

// 3. Refill completes
{ "type": "log", "data": { "timestamp": 28817.340, "message": "printer1 finishes refilling paper..." } }
{ "type": "consumer_update", "data": { "id": 1, "papersLeft": 100, "status": "idle" } }
```

## Message Ordering

When multiple events happen at the same timestamp, send messages in this order:
1. Log event first (for visibility)
2. State updates (consumers, jobs)
3. Stats update last (aggregated view)

## Frontend Handlers

The frontend processes these messages with these handlers:
- `simulationWS.onLog()` - Appends to event log (max 50 events)
- `simulationWS.onConsumerUpdate()` - Updates single consumer by ID
- `simulationWS.onConsumersUpdate()` - Replaces entire consumer array
- `simulationWS.onJobsUpdate()` - Replaces entire queue array
- `simulationWS.onStats()` - Updates stats display

## Best Practices

1. **Always send log events** for user visibility
2. **Keep jobs_update accurate** - only jobs in queue, not being served
3. **Update stats frequently** - especially queueLength and activeConsumers
4. **Include currentJobId** when consumer status is "serving"
5. **Send consumers_update at start** to initialize the pool
6. **Group related updates** at the same timestamp for atomicity
