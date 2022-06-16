// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { jestPreviewConfigure } from 'jest-preview';
import './index.css';

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically
  autoPreview: true,
});
