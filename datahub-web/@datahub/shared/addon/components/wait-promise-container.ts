import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/wait-promise-container';
import { containerDataSource } from '@datahub/utils/api/data-source';
import { ETaskPromise } from '@datahub/utils/types/concurrency';
import { task } from 'ember-concurrency';
import { set } from '@ember/object';
import { layout } from '@ember-decorators/component';

/**
 * WaitPromiseContainer will show spinner while the promise passed is being resolved
 *
 * usage:
 *
 * const promise = Promise.resolve(3);
 *
 * <WaitPromiseContainer @promise={{promise}} as |resolved|>
 *  {{resolved}}
 * </WaitPromiseContainer>
 *
 * should show '3' as the promise resolved '3'
 */
@layout(template)
@containerDataSource('getContainerDataTask', ['promise'])
export default class WaitPromiseContainer<T> extends Component {
  /**
   * Input promise that we want to wait
   */
  promise?: Promise<T>;

  /**
   * Value for the resolved promise that will be yielded
   */
  resolved?: T;

  /**
   * Will fetch and transform api data into status table input format
   */
  @task(function*(this: WaitPromiseContainer<T>): IterableIterator<Promise<T>> {
    const { promise } = this;
    if (promise) {
      const resolved: T = yield promise;
      set(this, 'resolved', resolved);
    }
  })
  getContainerDataTask!: ETaskPromise<T>;
}
