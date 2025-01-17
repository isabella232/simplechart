# ![Simplechart](docs/lib/images/logo.png)

Quickly create and structure interactive charts for use in a content management system (CMS).

**[Demo Simplechart here.](http://simplechart.io/)**

*See [Simplechart for WordPress](https://github.com/alleyinteractive/wordpress-simplechart) for the WordPress plugin.*

## Quick Start for Local Development
You'll need just a couple things installed before running Simplechart.

- Node _LTS or newer_
- NPM

You can confirm these packages are installed by running `node -v` or `npm -v` from your terminal.

1. Clone the Simplechart repository to your local machine using `git clone git@github.com:alleyinteractive/simplechart.git`.
2. Change directory to your newly created folder using `cd simplechart`.
3. Install the Node packages listed in *package.json* by running `npm install`.
4. Start the Node app using `npm run watch`.

Congrats! You should now be able to access Simplechart at `http://localhost:8080/index.html`.

For local development within the WordPress plugin, we recommend the **[Simplechart Dev Mode plugin](https://github.com/alleyinteractive/simplechart-dev-site#local-js-app-development)**.

## Use Cases
Simplechart provides the most utility at present when used in conjunction with [the WordPress plugin](https://github.com/alleyinteractive/wordpress-simplechart). You don't need to install this package to try the WordPress plugin.

Although we have focused on WordPress to date, Simplechart itself is CMS agnostic, and can even be used without a CMS. Simplechart allows you to control your own data, and customize default styling to maintain visual consistency with your brand.

Simplechart runs on modern web technology – React, WebPack, and ES5 – and Simplechart widgets are **AMP-compatible** out of the box.

Simplechart is licensed under [GPL-2.0](https://wordpress.org/about/gpl/).

## Extending Simplechart
Over on the Wiki, we've documented some common extensions for Simplechart.

- [How to add a new chart type]()
- [Connecting the app to your CMS]()
- [Structuring and optimizing widgets/embeds]()

## Contributing to Simplechart
We strongly encourage contributions, although we don't yet have formal contribution guidelines.

If you're thinking of a patch, feel free to reach out via a Github issue, or by creating a fork and sending us a pull request.
