import { Database, aql } from "arangojs";

export type RsVariant = {
  _key: string;
  _id: string;
  chr: string;
  'pos:long': number;
  rsid: string[];
  annotations: object;
}

export function getDatabase():Database{
  // console.log('connecting to db')
    return new Database({
        url: process.env.DB_URL,
        databaseName: process.env.DB_NAME,
        auth: { 
          username: process.env.DB_USERNAME, 
          password: process.env.DB_PASSWORD
        },
  });
}

/**
 * find a list of variants by rsid
 * @param db: the igvf catalog database
 * @param rsid: rsid to be queried 
 * @returns 
 */
export async function getVariantByRsid(db: Database, rsid: string): Promise<RsVariant[]> {
  const variants = db.collection("variants");
  try {
    const vs = await db.query(aql`
    FOR v IN ${variants}
    FILTER ${rsid} in v.rsid
    RETURN v
    `);
    let res:RsVariant[] = [];
    for await (const v of vs) {
      res.push(v);
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return [] as RsVariant[];
}

/**
 * get genes linked to a rsid
 * @param db 
 * @param rsid 
 * @param num: how many genes to return, default 5
 */
export async function getGenesLinkedToRsidKey(db: Database, rsidKey: string, num: number=5) {
  const genes = db.collection("genes");
  const variants = db.collection("variants");
  try {
    const gs = await db.query(aql`
    WITH ${variants}, ${genes}
      FOR v IN OUTBOUND ${rsidKey} variants_genes
      LIMIT ${num}
      RETURN v
    `);
    let res = [];
    for await (const g of gs) {
      res.push(g);
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return []
}

/**
 * get proteins linked to a rsid _id
 * @param db 
 * @param rsidKey 
 * @param num 
 * @returns 
 */
export async function getProteinsLinkedToRsidKey(db: Database, rsidKey: string, num: number=5) {
  const proteins = db.collection("proteins");
  const variants = db.collection("variants");
  try {
    const gs = await db.query(aql`
    WITH ${variants}, ${proteins}
      FOR v IN OUTBOUND ${rsidKey} variants_proteins
      LIMIT ${num}
      RETURN v
    `);
    let res = [];
    for await (const g of gs) {
      res.push(g);
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return []
}

/**
 * get drugs linked to a rsid _id
 * @param db 
 * @param rsidKey 
 * @param num 
 * @returns 
 */
export async function getDrugsLinkedToRsidKey(db: Database, rsidKey: string, num: number=5) {
  const drugs = db.collection("drugs");
  const variants = db.collection("variants");
  try {
    const gs = await db.query(aql`
    WITH ${variants}, ${drugs}
      FOR v IN OUTBOUND ${rsidKey} variants_drugs
      LIMIT ${num}
      RETURN v
    `);
    let res = [];
    for await (const g of gs) {
      res.push(g);
    }
    return res;
  } catch (err: any) {
    console.error(err.message);
  }
  return []
}