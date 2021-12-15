import fs from 'fs';
import path from 'path';
import { loadComponents, GiaComponentsRecord } from 'gia';
import { findByRole, fireEvent } from '@testing-library/dom';
import NavigationComponent from '../../client/navigation-component';

let container: HTMLElement;

const html = fs.readFileSync(
  path.resolve(__dirname, '../../../../_includes/nav.html'),
  'utf8'
);

const renderComponent = (
  htmlString: string,
  components: GiaComponentsRecord
) => {
  const sandboxed = document.createElement('div');
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = function bootstrapComponents() {
    loadComponents(components);
  };
  sandboxed.innerHTML = htmlString;
  sandboxed.appendChild(script);

  return sandboxed;
};

describe('site navigation', () => {
  beforeEach(() => {
    container = renderComponent(html, { NavigationComponent });
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
