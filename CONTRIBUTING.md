# Contributing to People of City

Thanks for wanting to make the city better. There are two ways to take part:

1. **Build your own city.** Fork the repo and make People of _your_ city. Show it off in [Discussions](https://github.com/peopleofcity/peopleofcity/discussions). If we love what you built, we'll bring it into People of Bengaluru and give you a shout-out.
2. **Improve the base.** Fix a bug or add something every city can use, through a pull request.

## Before you start

- For anything bigger than a small fix, **open an issue first** so we can agree on the approach before you spend time on it.
- Read [`design.md`](design.md) and [`sounddesign.md`](sounddesign.md) before changing how the city looks or sounds. They're specifications, not inspiration.
- Every screen works on touch, keyboard and the on-screen keyboard.

## Making a pull request

1. Fork, then branch from `main` (`fix/…`, `feat/…`).
2. Keep it to one change. Small PRs get reviewed fast.
3. Run `npm test` and `npx tsc --noEmit -p .`; the same checks run on your PR.
4. For anything visual, add a screenshot or a short clip.
5. A maintainer reviews it. `main` is protected: every change lands through a reviewed PR with green checks, squash-merged.

## Never commit

Keys, tokens, `.env` files or anyone's personal data. GitHub's secret scanning blocks known key formats on push.

## License

By contributing, you agree your contribution is licensed under the project's [GNU AGPL-3.0](LICENSE).
