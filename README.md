# Wonkypedia

Wonkypedia is a free encyclopedia for an alternative universe. It is
for those who have exhausted the rabbit holes of Wikipedia and want
to dive into an alternate timeline.

This uses Anthropic apis to generate wikipedia articles on the fly. It leans into the hallucination to
create a slightly alternate reality. The prior corpus of knowledge is fed into future article generations
so there is some level of consistency between generations (though not enough).

## See it in action

https://github.com/SawyerHood/wonkypedia/assets/2380669/5375b34f-c3c2-41d7-b98d-0dbbc7aeb42b

## What are people saying

> _Hahaha this is so dumb, I love it_
>
> \- **beatlz**, a random Redditor

## Gettings Started

The [actual website](https://www.wonkypedia.org) is deployed on vercel. But you can run it locally without all of the vercel dependencies.

1. First install `bun` and `docker`.
2. run `bun i`
3. run `docker compose up` to start the pg database
4. run `bun run drizzle-kit push:pg` to run migrations on the database
5. run `cp .env.sample .env`
6. [add your anthropic api key](https://console.anthropic.com/settings/keys) to `.env` (for article generation)
7. [add your cloudflare account id and token with workers ai permissions](https://dash.cloudflare.com/profile/api-tokens) to `.env` (for image generation)
8. run `bun run dev`
9. Hit localhost:3000 and you are ready to go!
