import { propertyDictionary, styledPropertyDictionary } from "@/lib/catalog-interface/definitions/filter-properties";
import { UserStory } from ".";

export const alleleFrequency: UserStory<{
    diseaseId: string;
    propertyPath: string;
    operator: string;
    value: number;
}> = {
    slug: "coding-variants-allele-freq",
    title: "Allele frequency filtering",
    description: "Filter by the allele frequency",
    steps: [
        {
            title: "Enter a disease ID.",
            description: "This will be the gene we will filter by. For example, Orphanet_166024.",
            key: "diseaseId",
            inputType: {
                type: "string",
            }
        },
        {
            title: "Select an allele frequency property to filter by.",
            description: "This will be the value which we will filter by.",
            key: "propertyPath",
            inputType: {
                type: "select",
                options: propertyDictionary.variant.map((p, idx) => ({
                    key: p,
                    name: styledPropertyDictionary.variant[idx],
                }))
            }
        },
        {
            title: "Select an operator.",
            description: "This will be the operator used to compare the allele frequency value.",
            key: "operator",
            inputType: {
                type: "select",
                options: [
                    {
                        key: "gt",
                        name: "greater than",
                    },
                    {
                        key: "gte",
                        name: "greater than or equal to",
                    },
                    {
                        key: "lt",
                        name: "less than",
                    },
                    {
                        key: "lte",
                        name: "less than or equal to",
                    },
                    {
                        key: "eq",
                        name: "equal to",
                    },
                    {
                        key: "neq",
                        name: "not equal to",
                    },
                ]
            }
        },
        {
            title: "Enter a decimal value.",
            description: "This will be the value which we will compare the allele frequency to. For example, 0.521.",
            key: "value",
            inputType: {
                type: "float"
            },
        }
    ],
    submit: (data, dispatch, router) => {
        
    },
}
