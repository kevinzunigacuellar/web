---
title: Add google analytics to Astro with Partytown
description: In this guide, you will learn how to add google analytics to Astro without blocking the main thread using the partytown integration
pubDate: 2022-05-12
updatedDate: 2023-06-04
hero: "~/assets/heros/astro_ga.png"
heroAlt: "Logo of Astro, partytown and google analytics together"
---

As your website attracts more visitors, you may need to incorporate various third-party scripts into your project to extend its functionality beyond the core features. Two common third-party scripts are Google Analytics and Facebook Pixel, which are web analytics services that help you assess and improve your website's effectiveness.

In this guide, we will focus on adding Google Analytics to your Astro project using Partytown, a web worker integration.

## 🧑‍💻 Getting Started

To begin, create a new Astro project using the CLI:

```bash
npm create astro@latest
```

Next, install the Astro integration for Partytown:

```bash
npm install -D @astrojs/partytown
```

Add the Partytown integration to your `astro.config.mjs` file with the following configuration options:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";

export default defineConfig({
  integrations: [
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
```

This configuration enables Partytown to forward all events to Google Analytics using `window.dataLayer`. For more information about configuration options, refer to the [Partytown documentation](https://partytown.builder.io/google-tag-manager#forward-events).

Create a Google Analytics account and obtain the tracking ID. After creating a new property for your domain, you can find the tracking ID in the **Property Settings**.

![Example of Google Analytics admin settings with a tracking ID](~/assets/content/tracking-setup.png)

## Hands-on Time

Now that we have the Partytown integration installed and the Google Analytics tracking ID, we can proceed with setting up our Google Analytics script.

Google Analytics will provide you with an inline script that will resemble the following:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

To enable Partytown to run Google Analytics in a web worker, make the following modifications to the script:

1. Replace `GA_MEASUREMENT_ID` with your tracking ID.
2. Add a `type` attribute and set it to `text/partytown` for both script tags. This informs Partytown which script tags to handle.

After applying the modifications, your updated script will look like this:

```astro title="Layout.astro"
<!-- head -->
<script
  type="text/partytown"
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script type="text/partytown">
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
<!-- more head -->
```

Finally, place this code snippet in the head section of your HTML. If you copy the code above, remember to update `GA_MEASUREMENT_ID` with your tracking ID.

Congratulations! You have successfully added Google Analytics to your Astro project. 🎉

## Testing

After deploying your project, visit your Google Analytics. You should see some recent activity after visiting your website.
![Google analytics real time dashboard with one visitor in the last 30 minutes](~/assets/content/realtime-dashboard.png)
