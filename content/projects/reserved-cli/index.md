---
title: Reserved CLI
date: 2024-01-05T17:44:46-04:00
draft: true
showTableOfContents: true
---

## Source

{{< github repo="snowboardit/reserved" >}}

## Philosophy

**Reserved** is named after reserved keywords in various programming and database languages like `for`, `WHERE`, and `set/SET`, to name a few. Even though it is named after reserved keywords, my inspiration to build it was instead sparked by keywords that are not technically reserved, but may as well be in the eyes of software developers. Its purpose is to quickly aid developers in solving the problem of naming things in our code, and more specifically, help them make better decisions around which names to use and not to use given their language(s) or stack of choice.

You see, I began learning Go not too long ago and was quickly exposed to [idiomatic Go](https://go.dev/doc/effective_go). Along with that came the consensus to do or name things a certain way from Go developers long before me. One of these agreed upon words to use in Go is `context` or `ctx`. You may have seen this in various places and it's not a reserved keyword by any means of the language. However to Go developers, it is a package and type, _"which carries deadlines, cancellation signals, and other request-scoped values across API boundaries and between processes"_ ([go/context](https://pkg.go.dev/context) )
