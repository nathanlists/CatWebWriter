# CatwebWriter (Lua to CatWeb Compiler)

Transpiling Lua like code into CatWeb JSON!

To use this, you now have to go to https://nathanlists.github.io/CatWebWriter/
Never been easier!

## Documentation

### I. INTRODUCTION

This language was created for a Roblox game called [CatWeb](https://www.roblox.com/games/16855862021/CatWeb-Make-a-Website), to make **complex CatWeb sites** much easier. CatWeb was not intended for complex sites, so you will struggle when making them. To make it easier, I made a Lua compiler for CatWeb. It supports expressions, if statements, and more. Any valid Lua code **may** be accepted by this compiler.

Best thing of all, it is **COMPLETELY FREE!** No paywalls just to improve code.

### SUPPORTED LUA FEATURES

These features are supported and compile easily to CatWeb JSON:

* Local Variables
* Functions (no return yet)
* Basic if statements (1 operator only)
* Math expressions when declaring variables
* For loops (no loop through tables yet)
* If statements

These features have been simplified:

* Functions (no local at start!)

### NOTES AND ADDITIONS TO LUA

1. Entry point - Declare a function named website_loaded.
```lua
function website_loaded()
   print("Hello, World!")
end
```

2. No semicolons at the end of lines!
