import { IssueData } from 'src/app/core/model/Feasibility/IssueData';
import { ValidationIssueData } from './Validation/ValidationIssueData';

export type DataportalErrorPayloadType = IssueData[] | ValidationIssueData[];
