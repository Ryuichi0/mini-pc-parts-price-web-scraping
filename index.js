import fs from "fs";
import { input, select, Separator } from "@inquirer/prompts";
import { getInfo } from "./sites/kakaku.js";

let exit = false;

let rawDataSession = fs.readFileSync("session.json");
let session = JSON.parse(rawDataSession);

const itemInfo = (item) => {
  return [
    {
      name: "preço:",
      value: "",
      disabled: session[item].price ? session[item].price + " ¥" : "? ¥",
    },
    {
      name: "id:",
      value: "",
      disabled: session[item].id ? session[item].id : "?",
    },
    {
      name: "vendedor:",
      value: "",
      disabled: session[item].seller ? session[item].seller : "?",
    },
  ];
};

do {
  const totalPrice = () => {
    let total = 0;
    Object.entries(session).forEach(([key, value]) => {
      total += Number(value.price);
    });
    return total;
  };
  const menu = await select({
    pageSize: 50,
    message: "Consultor de preços 8000",
    choices: [
      new Separator("-- Peças --"),
      {
        name: session.cpu.name ? "cpu: " + session.cpu.name : "cpu: -",
        value: "cpu",
        description: "Selecione para editar",
      },
      ...itemInfo("cpu"),
      {
        name: session.gpu.name ? "gpu: " + session.gpu.name : "gpu: -",
        value: "gpu",
        description: "Selecione para editar",
      },
      ...itemInfo("gpu"),
      {
        name: session.motherboard.name
          ? "motherboard: " + session.motherboard.name
          : "motherboard: -",
        value: "motherboard",
        description: "Selecione para editar",
      },
      ...itemInfo("motherboard"),
      {
        name: session.memoryRam.name
          ? "memoryRam: " + session.memoryRam.name
          : "memoryRam: -",
        value: "memoryRam",
        description: "Selecione para editar",
      },
      ...itemInfo("memoryRam"),
      {
        name: session.dataStorage.name
          ? "dataStorage: " + session.dataStorage.name
          : "dataStorage: -",
        value: "dataStorage",
        description: "Selecione para editar",
      },
      ...itemInfo("dataStorage"),
      {
        name: session.powerSupply.name
          ? "powerSupply: " + session.powerSupply.name
          : "powerSupply: -",
        value: "powerSupply",
        description: "Selecione para editar",
      },
      ...itemInfo("powerSupply"),
      {
        name: session.case.name ? "case: " + session.case.name : "case: -",
        value: "case",
        description: "Selecione para editar",
      },
      ...itemInfo("case"),
      new Separator("-- -- -- -- --"),
      {
        name: "Preço total:",
        value: "",
        disabled: String(totalPrice()),
      },
      new Separator("-- -- -- -- --"),
      {
        name: "confirmar",
        value: "exe",
        description: "Consultar os preços",
      },
      {
        name: "sair",
        value: "exit",
        description: "Sair",
      },
    ],
  });
  if (menu === "exit") {
    exit = true;
  } else if (menu === "exe") {
    if (
      session.cpu.id !== "" &&
      session.gpu.id !== "" &&
      session.motherboard.id !== "" &&
      session.memoryRam.id !== "" &&
      session.dataStorage.id !== "" &&
      session.powerSupply.id !== "" &&
      session.case.id !== ""
    ) {
      await getInfo(session);
    } else {
      console.log("Error");
    }
  } else if (menu === "") {
  } else {
    const editMenu = await select({
      pageSize: 20,
      message: "Editar " + menu,
      choices: [
        {
          name: "editar",
          value: "edit",
          description: "Editar",
        },
        {
          name: "cancelar",
          value: "",
          description: "Cancelar",
        },
      ],
    });
    if (editMenu === "edit") {
      const itemId = await input({
        message: "Digite o Id do item:",
        default: session[menu].id,
      });
      session[menu].id = itemId;
      session[menu].name = "";
      session[menu].price = "";
      session[menu].seller = "";
      fs.writeFileSync("session.json", JSON.stringify(session));
    }
  }
  console.log(menu);
} while (!exit);
