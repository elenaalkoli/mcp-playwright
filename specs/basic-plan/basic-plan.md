# MW Test Consultancy — Basic Functional Test Plan

Target site: https://www.mwtestconsultancy.co.uk/

## Test case 1 — Homepage loads successfully

- Steps:
  1. Open https://www.mwtestconsultancy.co.uk/
- Expected result:
  - The homepage is displayed.
  - Page title contains "MW Test Consultancy".

## Test case 2 — Main navigation menu is visible

- Steps:
  1. Open the homepage.
- Expected result:
  - Navigation contains visible links for Home, Books, Tools.
  - Links point to the correct target pages.

## Test case 3 — Books page opens

- Steps:
  1. From the homepage, click the Books link.
- Expected result:
  - The Books page loads.
  - Page title contains "Books".
  - Main heading or page content indicates book-related resources.

## Test case 4 — Tools page opens

- Steps:
  1. From the homepage, click the Tools link.
- Expected result:
  - The Tools page loads.
  - Page title contains "Software Testing Tools".
  - The page presents content related to software testing tools.

## Test case 5 — Sign in portal opens

- Steps:
  1. Open the homepage.
  2. Click the Sign in button or link.
- Expected result:
  - The sign in portal or sign in dialog opens.
  - The sign in flow is initiated via the Ghost CMS portal overlay.
  - Verify by checking the URL hash contains `#/portal/signin` after click, or that a portal iframe/modal becomes visible.

## Test case 6 — Subscribe portal opens

- Steps:
  1. Open the homepage.
  2. Click the Subscribe button or link.
- Expected result:
  - The subscribe portal or signup dialog opens.
  - The subscribe flow is initiated via the Ghost CMS portal overlay.
  - Verify by checking the URL hash contains `#/portal/signup` after click, or that a portal iframe/modal becomes visible.

## Test case 7 — Latest blog article opens from homepage

- Steps:
  1. Open the homepage.
  2. Click the first visible blog post card or article link.
- Expected result:
  - The blog article page loads.
  - The article title and author are visible.
  - The article URL is valid and returns a 200 response.

## Test case 8 — RSS feed is available

- Steps:
  1. Use Playwright APIRequestContext to request https://www.mwtestconsultancy.co.uk/rss/
- Expected result:
  - `response.status()` is 200.
  - The response body contains `<rss` or `<feed`.

## Test case 10 — Pagination next page opens

- Steps:
  1. Open https://www.mwtestconsultancy.co.uk/
  2. Click or navigate to the next page link (page/2/).
- Expected result:
  - The second page loads successfully.
  - The page title and content indicate page 2 or older posts.
  - HTTP status is 200.

## Test case 11 — Non-existent page returns 404

- Steps:
  1. Open https://www.mwtestconsultancy.co.uk/non-existent-page-xyz
- Expected result:
  - The page title or content indicates "404" or "Page not found".
  - HTTP response status is 404.

## Test case 9 — SEO metadata is present on homepage (low priority)

- Steps:
  1. Open the homepage.
  2. Inspect the HTML source.
- Expected result:
  - The homepage contains `canonical` link metadata.
  - The homepage contains `og:title`, `og:description`, and social metadata.
