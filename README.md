# A Hackers’ guide to override “New” button functionality with LWC modal

Recently in one of my projects I had a requirement to override the standard New button functionality with custom LWC component to accommodate some business logic.

After searching for the solution online, I came to know that:

1. It is currently not possible to use LWC directly to override the Standard New button. Instead, we have to use an Aura component as a wrapper, and then call the LWC from within the Aura component.

1. Even if we use this approach, the custom component will open in a new tab instead of a modal, which — albeit working perfectly fine — does not result in a good user experience. As shown below:

![Figure 1: Result after overriding Standard New button with LWC wrapped inside Aura](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*rdlll610Hba4uUuo4jzdTw.png)
_Figure 1: Result after overriding Standard New button with LWC wrapped inside Aura_

So, I started doing some throwaway prototyping and eventually came up with the solution that I have shared below.

![Figure 2: My custom solution with LWC Modal](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*ud-6MZ82uSKFDu-G1T8WVw.png)
_Figure 2: My custom solution with LWC Modal_

I'm sharing a link to the detailed article [here](https://medium.com/@arindam-karmakar/a-hackers-guide-to-override-new-button-functionality-with-lwc-modal-a39d35c73bc4). Please have a look at this and let me know if you have found any other workaround for this issue.
