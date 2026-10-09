---
title: About
date: 2024-01-05T16:45:37-04:00
description: Backend-focused full-stack engineer in Maine.
avatar: true
# Spec plate, shown next to the avatar. Values use " · " between items.
spec:
  - label: Based
    value: Maine
  - label: Stack
    value: Go · Node · Postgres · Redis · NATS · Docker · AWS
  - label: Interests
    value: Wrenching · Soaring · Farming · Woodworking · Snowboarding
---

I'm a backend-focused full-stack engineer in Maine. I build features across the stack, but my favorite work is the plumbing between services: distributed messaging and event-driven architecture.

At [Defendify](https://defendify.com), I moved our service-to-service gateway from HTTP to NATS: I wrote the spec, built the new engine, and led the migration of other services onto it. I also wrote the shared NATS request-reply library our Node services use.

I led the move of our document generation service to CloudEvents. That first needed a claim check: large payloads go to S3, and only a reference travels over NATS. I've also added OpenTelemetry tracing to a Go service in our security event pipeline and contributed to open-source tools like [slack-go/slack](https://github.com/slack-go/slack).

I came to software the long way: aviation school, commercial AV installs, IT at an MSP, then freelance work before Defendify. I care about clean architecture, the Unix philosophy, and simple code the next person can maintain.

Outside of work, I fly gliders and serve as a board member and webmaster for the [Franconia Soaring Foundation](https://soarfranconia.org/). For almost a year, I co-led the working group that met nearly every week to plan how we'd use our new training and operations center, and I helped plan and install its network cabling.

Home is a small farm in Maine with my wife, our greyhounds, cats, and horses. I love to tinker and get my hands dirty: cars, ATVs, mowers, woodworking, taking things apart to fix them, and the garden.

More detail on the [Experience](/experience/) page.
