import { CriteriaProfileProviderService } from '../../Provider/CriteriaProfileProvider.service';
import { CritGroupPosition } from 'src/app/model/FeasibilityQuery/CritGroupPosition';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { HashService } from '../../Hash.service';
import { Injectable } from '@angular/core';
import { ReferenceCriteriaData } from 'src/app/model/Interface/ReferenceCriteriaData';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { ReferenceCriterionProviderService } from '../../Provider/ReferenceCriterionProvider.service';
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { v4 as uuidv4 } from 'uuid';
import { TimeRestrictionNotSet } from '../../../model/FeasibilityQuery/Criterion/TimeRestriction/TimeRestrictionNotSet';
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service';

@Injectable({
  providedIn: 'root',
})
export class ReferenceFilterTranslatorService {
  constructor(
    private hashService: HashService,
    private criteriaProfileProviderService: CriteriaProfileProviderService,
    private referenceCriterionProviderService: ReferenceCriterionProviderService,
    private uiTimeRestrictionFactoryService: UITimeRestrictionFactoryService
  ) {}

  /**
   * Translates a reference filter.
   * @param parentId
   * @param criteria
   * @param referencedCriteriaSet
   * @returns
   */
  public translate(
    parentId: string,
    criteria: ReferenceCriteriaData[],
    referencedCriteriaSet: string[]
  ): ReferenceFilter {
    const referenceCriteria = this.createReferenceCriteria(parentId, criteria);
    const referenceFilter = this.createReferenceFilter(referencedCriteriaSet, referenceCriteria);
    this.referenceCriterionProviderService.setReferenceCriteriaById(referenceCriteria);
    return referenceFilter;
  }

  /**
   * Creates a reference filter instance.
   * @param referencedCriteriaSet
   * @param referenceCriteria
   * @returns
   */
  private createReferenceFilter(
    referencedCriteriaSet: string[],
    referenceCriteria: ReferenceCriterion[]
  ): ReferenceFilter {
    return new ReferenceFilter(uuidv4(), referencedCriteriaSet, referenceCriteria);
  }

  /**
   * Creates a reference criteria instance.
   * @param parentId
   * @param criteria
   * @returns
   */
  private createReferenceCriteria(
    parentId: string,
    criteria: ReferenceCriteriaData[]
  ): ReferenceCriterion[] {
    return criteria.map((referenceCriterion) =>
      this.createSingleReferenceCriterion(parentId, referenceCriterion)
    );
  }

  /**
   * Creates a single reference criterion instance.
   * @param parentId
   * @param referenceCriterion
   * @returns
   */
  private createSingleReferenceCriterion(
    parentId: string,
    referenceCriterion: ReferenceCriteriaData
  ): ReferenceCriterion {
    const termCode = TerminologyCode.fromJson(referenceCriterion.termCodes[0]);
    const contextCode = TerminologyCode.fromJson(referenceCriterion.context);
    const hash = this.hashService.createCriterionHash(contextCode, termCode);
    const uiProfile = this.criteriaProfileProviderService.getCriteriaProfileByHash(hash);
    const timeRestriction = !referenceCriterion.timeRestriction
      ? new TimeRestrictionNotSet()
      : this.uiTimeRestrictionFactoryService.createTimeRestrictionForFeasibilityQuery(
          referenceCriterion.timeRestriction
        );

    return new ReferenceCriterion(
      parentId,
      true,
      [],
      contextCode,
      hash,
      Display.fromJson(uiProfile.display),
      false,
      false,
      new CritGroupPosition(),
      [termCode],
      timeRestriction,
      uuidv4(),
      []
    );
  }
}
