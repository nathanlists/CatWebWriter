# CatwebWriter

Transpiling Lua/Python like code into CatWeb JSON!

To use this, you now have to go to https://nathanlists.github.io/CatWebWriter/
Never been easier!

## Documentation

### I. INTRODUCTION

This language was created for a Roblox game called [CatWeb](https://www.roblox.com/games/16855862021/CatWeb-Make-a-Website), to make **complex CatWeb sites** much easier. CatWeb was not intended for complex sites, so you will struggle when making them. To fix this,
I made a new language, CatVB (Catweb Visual Basic). Like Visual Basic which made programming software in Windows much easier, CatVB makes programming sites in CatWeb much easier.

This also allows AI to be trained to help in making CatVB code much easier, as instead of block or JSON based coding, it is now text based.

Best thing of all, it is **COMPLETELY FREE!** No paywalls just to improve code.

### II. BASIC SYNTAX
#### DATA TYPES

CatVB has 3 fundamental data types as of 0.1.1 (String, Number, Variable), but more CatVB features will be added that can expand this. 

**Strings** - Holds raw text. Can be identified by double quotes around the text "

**Numbers** - Holds numbers

**Variables** - Holds a variable.

#### VARIABLES

Variables is a data type that holds a variable. Variables are containers that contain data. The variable name is an identifier to
identify the data from RAM.

Variables can be defined by the "set" function:

set (variable name) = (variable data)

Examples:

```
set myVar = 5
```
```
set myVar = "String"
```

#### OPERATORS AND STATEMENTS

Operators and statements allow for easy identification, logic and calculation.

Note that statements end with a colon like this:

```
when websiteloaded:
```

**when** - Used to recieve events

**end** - Used to end a statement.

#### COMMENTS

Coming soon!

### III. INPUT AND OUTPUT

#### CONSOLE FUNCTIONS

These functions allow you to send output to the console.

**log (any)** Prints the output to the console.
```
log "Hello World"
```

#### EVENTS

Events allow you to recieve calls or events from the engine or system like button presses and more.

**websiteloaded** - The code inside is executed if the website is loaded.
```
when websiteloaded:
end
```
