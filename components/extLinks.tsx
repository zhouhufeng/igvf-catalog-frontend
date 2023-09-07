/**
 * this file contains links to external databases based on id or names
 * naming: typeDataBaseByNameorId
 */

export function ProteinUniprotByName({ name }: { name: string }): JSX.Element {
    return <a href={`https://www.uniprot.org/uniprot/${name}`} target='_blank'>UniProt</a>;
}

export function ProteinUniprotById({ id }: { id: string }): JSX.Element {
    return <span>UniProt: <a href={`https://www.uniprot.org/uniprotkb/${id}/entry`} target='_blank'>{id}</a></span>;
}

export function GeneEnsemblById({ id }: { id: string }): JSX.Element {
    return <span>Ensembl: <a href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${id}`} target='_blank'>{id}</a></span>;
}

export function GeneGenecardsByName({ name }: { name: string }): JSX.Element {
    return <a href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${name}`} target='_blank'>Genecards</a>;
}

export function PubMedLink({ pmid }: { pmid: string }): JSX.Element {
    //PMID:34910505
    let id = pmid;
    if (pmid.startsWith('PMID:')) {
        id = pmid.split(':')[1]
    }
    return <span>PubMed: <a href={`https://pubmed.ncbi.nlm.nih.gov/${id}`} target='_blank'>{id}</a></span>;
}