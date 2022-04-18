import { GiaComponentsRecord, loadComponents } from 'gia';

/**
 * @description Helps with rendering Gia Components for testing purposes
 * @param htmlString
 * @param components
 */
const renderHtmlComponent = (
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

export default renderHtmlComponent;
