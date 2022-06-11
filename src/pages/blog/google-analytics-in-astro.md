---
layout: '../../layouts/BlogLayout.astro'
title: Add google analytics to your Astro project with Partytown
heroImage: /public/assets/astro_ga.png
imageAlt: 'Logo of Astro, partytown and google analytics together'
setup: import Image from '../../components/Image.astro'
pubDate: 2022-05-12
description: In this guide, you will learn how to add google analytics to your Astro project 🚀 using a web worker with Partytown.
---

With more visitors coming into your website, you will need to add different
third party scripts to your project that will provide functionality beyond the
core functionality of your website.

The most common third party scripts are Google Analytics and Facebook Pixel
which are web analytics services that will help you assess and improve the
effectiveness of your website.

In this guide, we will learn how to add google analytics to your Astro project
using a web worker with Partytown.

## 🧑‍💻 Getting started

Create a new Astro project with the CLI

```bash
npm create astro@latest
```

Install the Astro integration for Partytown:

```bash
npm install -D @astrojs/partytown
```

Add the partytown integration to your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config'
import partytown from '@astrojs/partytown'

export default defineConfig({
  integrations: [partytown()],
})
```

Create a google analytics account and get the tracking ID. You can find the
tracking ID in the analytics console of your google account.

<Image src="/public/assets/ga-astro-partytown/tracking-setup.png" alt="Example of google analytics admin settings with a tracking ID" />

## 🚀 Hands-on time!

Now that we have the partytown integration installed and our google analytics
tracking ID, we can start setting up our third party analytics.

Google Analytics will provide your with an inline script that will be very
similar to the following one:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())

  gtag('config', 'GA_MEASUREMENT_ID')
</script>
```

Modify the script above to allow partytown to run google analytics in a web
worker.

1. Replace the `GA_MEASUREMENT_ID` with your own tracking ID.
2. Add a `type` attribute set to `text/partytown` to both scripts. This tells
   partytown which script to handle.
3. Add a new inline script before both google analytics scripts to configure
   your partytown options. The following configuration allows partytown to
   forward calls to `window.dataLayer` which google uses to send events.

Our new script will look like this after all the modifications:

```astro
<!-- head -->
<script is:inline>
  partytown = {
    forward: ['dataLayer.push'],
  }
</script>
<script type='text/partytown' src='https://www.googletagmanager.com/gtag/js?id=G-5BF82W8RSV'>

</script>
<script type='text/partytown'>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'G-5BF82W8RSV')
</script>
<!-- more head -->
```

> Important: The config script should be placed before both google analytics
> scripts.

Finally, place this code snippet in the head of your html. If you are coping the code above do not forget to update your **google tracking id**.

Congratulations, you have
successfully added google analytics to your Astro project 🚀!

## Testing 👩‍🔬

After deploying your project, go to your google analytics
real time dashboard. You should see some recent
activity after visiting your website.

<Image src="/public/assets/ga-astro-partytown/real-time-dashboard.png" alt="Google analytics real time dashboard with one visitor in the last 30 minutes" />
