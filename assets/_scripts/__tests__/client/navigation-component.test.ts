import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { loadComponents, GiaComponentsRecord } from 'gia';
import { findByRole, fireEvent } from '@testing-library/dom';
import NavigationComponent from '../../client/navigation-component';

let dom;
let container: HTMLElement;

const html = fs.readFileSync(
  path.resolve(__dirname, '../../../../_includes/nav.html'),
  'utf8'
);

const renderComponent = (
  htmlString: string,
  components: GiaComponentsRecord
) =>
  new JSDOM(
    `
    ${htmlString}
    <script>
      ${loadComponents(components)}
    </script>
  `,
    { runScripts: 'dangerously' }
  );

describe('site navigation', () => {
  beforeEach(() => {
    dom = renderComponent(html, { NavigationComponent });
    container = dom.window.document.body;
  });

  it('renders the nav block', () => {
    expect(container.querySelector('.ns-header')).not.toBeNull();
  });

  it('clicking the search button sets the search-expanded attribute', async () => {
    const button = await findByRole(container, 'button');

    expect(
      container.querySelector('.ns-header[search-expanded]')
    ).toBeNull();

    fireEvent.click(button);

    expect(
      container.querySelector('.ns-header[search-expanded]')
    ).toBeDefined();
  });
});
