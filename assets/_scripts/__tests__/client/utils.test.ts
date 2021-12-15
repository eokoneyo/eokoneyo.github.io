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
    container = document.createElement('div');
    container.innerHTML = 'SUT';
  });

  describe('setAttributes', () => {
    it.skip('sets the attributes using the object provided', async () => {
      const SUT = await findByText(container, 'SUT');

      setAttributes(SUT, {
        'data-testid': 'hello',
      });

      expect(await findByTestId(SUT, 'hello')).toBeDefined();
    });
  });

  describe('hasClass', () => {
    it('returns a boolean indicating whether the provided element has the class name in question', async () => {
      const testClassName = 'random-test';

      expect(hasClass(container, testClassName)).toStrictEqual(
        expect.any(Boolean)
      );

      setAttributes(container, {
        class: testClassName,
      });

      expect(hasClass(container, testClassName)).toBe(true);
    });
  });

  describe('addClass', () => {
    it('adds the specified class name to the provided element', async () => {
      const testClassName = 'add-className-test';

      addClass(container, testClassName);

      expect(hasClass(container, testClassName)).toBe(true);
    });
  });

  describe('removeClass', () => {
    it('removes the specified class name from the provided element', async () => {
      const testClassName = 'remove-className-test';

      addClass(container, testClassName);

      expect(hasClass(container, testClassName)).toBe(true);

      removeClass(container, testClassName);

      expect(hasClass(container, testClassName)).toBe(false);
    });
  });
});
