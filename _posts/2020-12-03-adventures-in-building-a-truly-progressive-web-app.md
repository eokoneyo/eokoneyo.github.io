---
layout: post
title: Adventures in building a truly Progressive Web App
tag: web
category: blog
excerpt: The KongaEZ PWA case study.
published: false
---

I've hoped someone else on the frontend team at Konga would write about this, but it doesn't seem like that's happened.
I've been rebuilding my website, so I thought to revisit one of the really exciting times I've had as a frontend developer.

I joined Konga[^1] just right after the first version of it's acclaimed PWA had been built,
acclaimed in the sense that it was heavily featured by Google[^2] and was quite a highlight at the 2016 progressive web app summit[^3] as much as this first iteration was successful in that it did achieve the reasons it was built for,
it was found out that there was still a large chunk of users that it wasn't able to capture. The main reasons for building the first probably held truer than was realized,
in Nigeria at the time, data bundles weren't exactly cheap. To help set perspective as to why it's not too much of a surprise, I recall paying around #200 for 10Mb when I was in the equivalent of high school to download "Asphalt" (a game of about 200KB) on my Nokia 6085
and it still didn't complete the download with all my mobile data lost. we found out a huge percentage of users, about 50% of users that visited the Konga website used Opera Mini (I'm talking about versions that used the Presto engine). The Opera Mini browser probably had the best data-saving features, they would run website code on their servers and present the resulting HTML to users as OBML[^4],
as you can imagine that didn't make the Polymer[^5] version of Konga's PWA exactly the best shopping experience on Opera Mini because of its architecture for resolving webpage and as you can imagine there were no guarantees that actions that were solely handled in Javascript would work,
don't get me wrong it was definitely better than what users were afforded before KongaEZ v1 (from here on I will refer to the acclaimed PWA as KongaEZ v1) was realized in terms of data consumption,
but it still didn't make it easy to achieve our main goal help the user get to check out as seamless as possible.

As a response to this issue that was discovered the team decided to undertake another experiment, create a purely server-side rendered (actually labelling apps as SSR wasn't exactly a thing at the time) for that would be served to user's visiting Konga on an Opera Mini browser, done directly on the CDN layer,

{% include image-zoom.html image="/assets/img/portfolio/kongaEZ.png" alt-text="kongaEZ v2" disableZoom="true" %}

After launching it, just in time for Konga's version of Black Friday called "Yakata", it was much more performant than we anticipated,
post-launch and Black Friday we slide into maintenance mode we were happy with what we had built but soon realized now we had two different apps that served mobile,
you see we were serving KongaEZ v1 to Android and iOS devices as long as they weren't using Opera Mini and users that came in through Opera Mini got KongaEzv2 which meant for every new feature we had to implement said a new feature in both places and that wasn't a great use of resource.

Soon enough we started thinking about a way in which we might be able to get the best of both worlds, we liked that KongaEzv2 was so lightweight. I mean with a proper image service setup even on product listing page we were averaging 200kb at the most. 
KongaEZv1 was great, but the TTI (Time To interactive) and TTFP (Time To First Paint) it had didn't compare to v2,
more so v2 provided a guarantee that even if a user visited Konga with UC browser 
(which was another browser that started picking up in popularity with data saving features as aggressive as Opera Mini in Nigeria) 
users were guaranteed to browse through the offering we had and successfully checkout at a considerably reduced cost to their data. 
We quickly realized the version we wanted to serve to all our users was KongaEZv2
progressively enhanced, this time allowing the application itself to decide who got the upgraded experience instead of the CDN as we currently had it, 
there was the issue of figuring out how to run our NodeJS app with DustJS[^6] templating within the browser but thankfully there was already a library RillJs[^7] that could allow us to switch ExpressJS for RillJS when our app is running on the browser with a custom renderer for 
handling DustJS in the browser with all this our whole NodeJS app was able to run in the browser besides the with no extra changes other than I mentioned.

The next step was deciding the criteria for providing enhanced experience, we decided to use browser and language features available to decide who got the upgraded experience.
this also meant we did not need polyfills if a user's browser did not support the required defining feature set for the upgraded experience they simply used the base experience 
that was still very much capable to accomplishing all they needed to perform our own defined critical path (i.e. getting the user from product listings to checkout)

A few of the ideologies for how the PWA was built is used in [this project](https://github.com/eokoneyo/booking_hackathon_stepup){:target="_blank"}, if you're looking to see how it all fit together

After all, is said and done, in my opinion, there's a couple of reasons I'd say this big experiment was a success;
- We had a performance budget[^8] from the get-go
- The architecture we choose for the app even though every page was going to be rendered on the server was optimized; 
  dustjs templates were pre-built on build this helped for both server rendering and client-side rendering an enhanced experience 
  is being offered then there was also taking the lessons we learnt from KongaEZv1, we had a serviceworker
- We demanded more from our marketing partners, so we wouldn't have to load their JS SDKs. 
  I recall multiple meetings with the Criteo[^9] team trying to figure out how we might still be able to send data to them without using javascript, 
  something as trivial might be important to your app but it surely was to use we wanted to save the bytes' user's requested at any opportunity we could.
- We had full control on how payment is handled at checkout, so there was also no need to load any javascript to handle that as Konga had an in house payment solution[^10] that provided an API that handled switching at the backend even users that didn't have a KongaPay account.
- I wouldn't advise everyone to do this but considering we knew our app didn't have any complex UI, all the CSS for the website was handwritten, no frameworks. Our entire stylesheet all bundled together wasn't even up to 25KB.

I know the subject of what progressive enhancement means is quite touchy as is proof in the responses to the article that Nolan Lawson wrote[^11], but I'm of the option that a progressive web app inspite of however close to native functions it provides should also cater to users on both extremes of the spectrum, but still at the same time it's up to the web app developer's team to decide how far in this range they like to cover. Use your superpowers wisely! 

### References
[^1]: [Konga](https://konga.com){:target="_blank"}
[^2]: [KongaEZ; Google Case Study](https://developers.google.com/web/showcase/2016/konga){:target="_blank"}
[^3]: [Summit Report: Building one of Africa's most successful PWAs (Progressive Web App Summit 2016)](https://www.youtube.com/watch?v=SlgcVl8pZDQ){:target="_blank"}
[^4]: [Opera Binary Markup Language](https://dev.opera.com/articles/opera-binary-markup-language/){:target="_blank"}
[^5]: [Polymer](https://www.polymer-project.org/){:target="_blank"}
[^6]: [DustJS](https://www.dustjs.com/){:target="_blank"}
[^7]: [RillJS](https://github.com/rill-js/rill){:target="_blank"}
[^8]: [Can You Afford It?: Real-world Web Performance Budgets](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/){:target="_blank"}
[^9]: [Criteo](https://www.criteo.com/){:target="_blank"}
[^10]: [KongaPay](https://www.kongapay.com/){:target="_blank"}
[^11]: [Progressive enhancement isn’t dead, but it smells funny](https://nolanlawson.com/2016/10/13/progressive-enhancement-isnt-dead-but-it-smells-funny/){:target="_blank"}
