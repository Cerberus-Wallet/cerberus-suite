import { SuiteAnalyticsEvent } from '@cerberus/suite-analytics';
import { urlSearchParams } from '@cerberus/suite/src/utils/suite/metadata';

export type Requests = ReturnType<typeof urlSearchParams>[];

export type ExtractByEventType<EventType> = Extract<SuiteAnalyticsEvent, { type: EventType }>;

export type EventPayload<T extends SuiteAnalyticsEvent> = T extends { payload: infer P }
    ? P
    : undefined;
