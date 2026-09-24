# Add Calendly Booking Calls to Action

## What will change
- Add a prominent booking block immediately after the service sections.
- Replace the static calendar placeholder in the contact area with the real Calendly scheduler.
- Show a clear loading state while Calendly opens, a confirmation message when a booking is completed, and a direct Calendly link if the embedded scheduler cannot load.
- Keep the existing enquiry form as the secondary contact option.

## Validation
- Verify both booking calls to action on desktop and mobile.
- Confirm the direct-link fallback works and no page errors are introduced.

## Technical details
- Use Calendly's official inline embed and booking event message rather than inventing appointment availability.
- Reuse one focused scheduler component in both positions to keep the behavior consistent.
