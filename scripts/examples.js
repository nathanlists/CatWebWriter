console.log("Loaded examples.js");

const examples = {
  blocks: {
    0: {
      id: "0",
      text: ["Log", {
        value: "",
        t: "any"
      }]
    },
    11: {
      id: "11",
      text: [
        "Set",
        {
          value: "",
          l: "variable",
          t: "string"
        },
        "to",
        {
          value: "",
          l: "any",
          t: "string"
        }
      ],
      globalid: "Z>"
    },
    87: {
      "id": "87",
      "text": ["Run function", {
        "value": "a",
        "t": "string",
        "l": "function"
      }, {
        value: [{
          "value": "ta",
          "l": "any",
          "t": "string"
        }, {
          "value": "tb",
          "t": "string",
          "l": "any"
        }],
        "t": "tuple"
      }, "→", {
        "value": "b",
        "t": "string",
        "l": "variable?"
      }],
      "globalid": "@F"
    },
    18: {"text":["If",{"value":"a","l":"any","t":"string"},"is equal to",{"value":"b","l":"any","t":"string"}],"globalid":"9L","id":"18"},
    25: {"id":"25","text":["end"],"globalid":"Nb"},
    12: {"id":"12","text":["Increase",{"value":"a","l":"variable","t":"string"},"by",{"value":"1","t":"number"}],"globalid":"#g"},
    13: {"id":"13","text":["Decrease",{"value":"a","l":"variable","t":"string"},"by",{"value":"1","t":"number"}],"globalid":"ib"},
    14: {"id":"14","text":["Multiply",{"value":"a","l":"variable","t":"string"},"by",{"t":"number","value":"1"}],"globalid":"j`"},
    15: {"id":"15","text":["Divide",{"value":"a","l":"variable","t":"string"},"by",{"value":"1","t":"number"}],"globalid":"h0"},
    40: {"id":"40","text":["Raise",{"value":"a","l":"variable","t":"string"},"to the power of",{"value":"1","t":"number"}],"globalid":"Y*"},
    22: {"id":"22","text":["Repeat",{"t":"number"},"times"],"globalid":"8g"},
    20: {"text":["If",{"t":"string","l":"any"},"is greater than",{"t":"string","l":"any"}],"globalid":"3S","id":"20"},
    21: {"text":["If",{"t":"string","l":"any"},"is lower than",{"t":"string","l":"any"}],"globalid":"BB","id":"21"}
  },
  "script": [{
    "class": "script",
    "globalid": ".,",
    "alias": "Script",
    "content": []
  }],
  "website_loaded": {
    "y": "4908",
    "x": "4876",
    "globalid": "t.",
    "id": "0",
    "text": ["When website loaded..."],
    "actions": [],
    "width": "350"
  },
  "func": {
    "y": "4911.4443359375",
    "variable_overrides": [{"value":"a"}, {"value":"b"}],
    "x": "4837.0322265625",
    "globalid": "|^",
    "id": "6",
    "text": ["Define function", {
      "value": "a",
      "t": "string",
      "l": "function"
    }],
    "actions": [],
    "width": "350"
  }
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}

function randomglobalid() {
  const char1 = String.fromCharCode(getRandomIntInclusive(33, 96));
  const char2 = String.fromCharCode(getRandomIntInclusive(33, 96));
  return char1 + char2;
}
function processValue(value) {

    if (value.startsWith("{") && value.endsWith("}")) {
        const expression = value.slice(1, -1);

        try {
            return String(math.evaluate(expression));
        } catch (error) {
            throw new Error(`Invalid constant expression: ${expression}`);
        }
    }

    return value;
}
export function retObj(id, v = [], tv = []) {
    if (!examples.blocks[id]) {
        throw new Error(`Template with id "${id}" does not exist.`);
    }
  v.forEach((vl, ind) => {
    v[ind] = vl;
  });
  tv.forEach((vl, ind) => {
    tv[ind] = vl;
  });
    v = v.map(val => {
        if (
            typeof val === "string" &&
            val.startsWith('"') &&
            val.endsWith('"')
        ) {
            return val.slice(1, -1);
        }

        return val;
    });

    const obj = structuredClone(examples.blocks[id]);

    const inputObjects = obj.text.filter(
        item => item !== null && typeof item === "object"
    );

    inputObjects.forEach((inputObj, index) => {

        // Normal input
        if (inputObj.t !== "tuple") {
            inputObj.value = String(v[index] ?? "");
            return;
        }
              // Tuple input
        inputObj.value.forEach((tupleObj, tupleIndex) => {
          console.log(tv[tupleIndex])
            tupleObj.value = String(tv[tupleIndex] ?? "");
        });
    });

    if (Object.hasOwn(obj, "globalid")) {
        obj.globalid = randomglobalid();
    }

    return obj;
}
export function returnEventobj(func, code) {
  const funcJSON = structuredClone(examples[func])
  funcJSON["actions"] = code
  funcJSON["globalid"] = randomglobalid();
  return funcJSON
}
export function returnFunctionobj(func, code, params) {
  const funcJSON = structuredClone(examples["func"])
  funcJSON["text"][1]["value"] = func.replaceAll("()", "")
  funcJSON["actions"] = code
  funcJSON["globalid"] = randomglobalid();
  return funcJSON
}
export function returnScriptobj(objs, oname) {
  const scriptJSON = structuredClone(examples["script"]);
  scriptJSON[0]["content"] = objs;
  scriptJSON[0]["alias"] = oname;
  return scriptJSON;
}