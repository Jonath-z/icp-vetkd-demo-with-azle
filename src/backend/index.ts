import { Canister, Principal, StableBTreeMap, ic } from "azle";
import express from "express";
import { vetkd } from "../declarations/vetkd";

type Note = {
  title: string;
  content: string;
};

const notes = StableBTreeMap<string, Note[]>(1);
const users = StableBTreeMap<string>(2);
const textEncoder = new TextEncoder();

const app = express();

app.use(express.json());

// app.post("/user", (req, res) => {
//   const body = req.body;

//   return res.json(req.body);
// });

app.post("/note/:principal", async (req, res) => {
  const params = req.params;
  const _notes = notes.get(params.principal).Some;

  // const key = VetKeyCanister.vetkd_public_key({
  //   canister_id: [],
  //   derivation_path: [textEncoder.encode("symmetric_key")],
  //   key_id: {
  //     name: "test_key",
  //     curve: {
  //       bls12_381: null,
  //     },
  //   },
  // });

  console.log({ vetkd });
  try {
    const key = await vetkd.vetkd_public_key({
      canister_id: [Principal.fromHex("br5f7-7uaaa-aaaaa-qaaca-ca")],
      derivation_path: [textEncoder.encode("symmetric_key")],
      key_id: {
        name: "test_key",
        curve: {
          bls12_381: null,
        },
      },
    });

    return res.json({ _notes, vetkd, key, env: process.env });
  } catch (err) {
    return res.status(500).json({ err, vetkd });
  }
});

app.post("/note", async (req, res) => {
  const body = req.body;
  const canister = Canister({});

  const vetkdCanister = canister(
    Principal.fromHex("br5f7-7uaaa-aaaaa-qaaca-cai")
  );

  const getNotes = notes.get(body.principal).Some;
  const notesToSave = { title: body.title, content: body.content };
  if (getNotes?.length > 0)
    notes.insert(body.principal, [...getNotes, notesToSave]);
  else notes.insert(body.principal, [notesToSave]);
  return res.json({ notesToSave, vetkdCanister });
});

app.listen();
