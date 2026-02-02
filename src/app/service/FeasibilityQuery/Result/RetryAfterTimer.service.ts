import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  interval,
  map,
  shareReplay,
  startWith,
  Subscription,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RetryAfterTimerService {
  private retryUntil$ = new BehaviorSubject<number | null>(null);
  private timerSub?: Subscription;

  /** emits remaining seconds */
  readonly remainingSeconds$ = this.retryUntil$.pipe(
    filter((v): v is number => v !== null),
    switchMap((seconds) =>
      interval(1000).pipe(
        startWith(0),
        map((elapsed) => seconds - elapsed),
        takeWhile((remaining) => remaining >= 0)
      )
    ),
    shareReplay(1)
  );

  public start(seconds: number): void {
    this.retryUntil$.next(seconds);
  }

  public clear(): void {
    this.retryUntil$.next(null);
    this.timerSub?.unsubscribe();
  }
}
