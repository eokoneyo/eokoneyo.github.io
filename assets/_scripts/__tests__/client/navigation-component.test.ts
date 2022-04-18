import fs from 'fs';
import path from 'path';
import { findByRole, fireEvent } from '@testing-library/dom';
import renderHtmlComponent from '../helpers/renderHtmlComponent';
import NavigationComponent from '../../client/navigation-component';

let container: HTMLElement;

const html = fs.readFileSync(
  path.resolve(__dirname, '../../../../_includes/nav.html'),
  'utf8'
);

describe('site navigation', () => {
  beforeEach(() => {
    container = renderHtmlComponent(html, { NavigationComponent });
  });

  it('renders the nav block', () => {
    expect(container.querySelector('.ns-header')).not.toBeNull();
  });

  it('clicking the search button sets the search-expanded attribute', async () => {
    const button = await findByRole(container, 'button');

    expect(container.querySelector('.ns-header[search-expanded]')).toBeNull();

    fireEvent.click(button);

    expect(
      container.querySelector('.ns-header[search-expanded]')
    ).toBeDefined();
  });
});
