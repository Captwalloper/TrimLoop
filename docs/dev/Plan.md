# So starting off:

* Setup VSCode
  * Create workspace
  * Setup Extensions
  * Configure Project
  * Configure Agent
  * (Meanwhile use gemini)

Notes...
So looks like Continue + Ollama is the way. This is it's own night of work to get working... let's go!
... That took like 30m... much easier than expected.
Now I get to pester the agent!

So... the continue + Ollama was every effective. Gemini definitely helped fill in the cracks tho.
I was able to hack together a basic AB looper. I definitely need to clean it up to only the necessary files tho.
I think I'll make seperate commits, then squash into an initial prototype.
Actually, I just cleaned stuff up and made an initial prototype commit.
## 2 next steps:
1. Test Suite
2. Full type checking

So... testing might be manual. I *could* automate testing with playwright, but that'd be a project in itself.
Also, I'd be fighting the entire ecosystem. A lightweight, simple, sturdy e2e test enviornment DOESN'T EXIST.
I'd have to add:
1. npm
2. a way to download a test instance of chrome (and keep it up to date)
3. playwright or similar
4. taskrunner
I was considering doing that for learning purposes, but the proportion of time I'd spend on fluff that would NEVER be sturdy is noise.
To maximize signal, I need to figure out a good manual-ish test.
Maybe a test.html that loops tests and relies on visual confirmation? (with a info popup button?)
So I can use a test.html file for this. Plan is:
1. Embed a video of test.mp4 on the left half of the page
2. Embed an iframe of the extension popup on the right half of the page
3. On the bottom 20% of the page, show the running test and all of its logs. Need both running test and suite status.
4. Include a link to open a test doc on the test.html page. 

So after fighting to center elements, because html/css, and then bumping HARD against iframe sandboxing, I finally finished test.html.
Except the visuals, I'm happy with the result. Last thing is to add a url for test.md. And also to write test.md...
I should also try to leverage AI more. A 2 agent approach seems to work well: editor=embedded + exterior.
Next step is reworking UX/UI.

I'll describe UI/UX in words for an AI to brainstorm:
Mock up a UI for a chrome extension that allows users to loop a video from user selected timestamps A to B.
The UI should be simple, sleek, and blend in with night mode.
LOL, so AI did... pretty meh. It did inspire me to do better tho. I came up with a very simple basic layout.
Now, I gotta make the individual components. First is a button with an "Icon". Something very simple, svg or css.