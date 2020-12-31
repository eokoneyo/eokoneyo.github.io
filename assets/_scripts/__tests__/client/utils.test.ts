import { JSDOM } from 'jsdom';
import { findByText, findByTestId } from '@testing-library/dom';
import {
  setAttributes,
  hasClass,
  addClass,
  removeClass,
} from '../../client/utils';

describe('utils', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = new JSDOM(`<div>SUT</div>`).window.document.body;
  });

  describe('setAttributes', () => {
    it('sets the attributes using the object provided', async () => {
      const SUT = await findByText(container, 'SUT');

      setAttributes(SUT, {
        'data-testid': 'hello',
      });

      expect(await findByTestId(container, 'hello')).toBeDefined();
    });
  });

  describe('hasClass', () => {
    it('returns a boolean indicating whether the provided element has the class name in question', async () => {
      const testClassName = 'random-test';

      const SUT = await findByText(container, 'SUT');

      expect(hasClass(SUT, testClassName)).toStrictEqual(expect.any(Boolean));

      setAttributes(SUT, {
        class: testClassName,
      });

      expect(hasClass(SUT, testClassName)).toBe(true);
    });
  });

  describe('addClass', () => {
    it('adds the specified class name to the provided element', async () => {
      const testClassName = 'add-className-test';

      const SUT = await findByText(container, 'SUT');

      addClass(SUT, testClassName);

      expect(hasClass(SUT, testClassName)).toBe(true);
    });
  });

  describe('removeClass', () => {
    it('removes the specified class name from the provided element', async () => {
      const testClassName = 'remove-className-test';

      const SUT = await findByText(container, 'SUT')

      addClass(SUT, testClassName);

      expect(hasClass(SUT, testClassName)).toBe(true);

      removeClass(SUT, testClassName)

      expect(hasClass(SUT, testClassName)).toBe(false);
    });
  });
});
