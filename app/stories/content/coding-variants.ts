import { propertyDictionary, styledPropertyDictionary } from "@/lib/catalog-interface/definitions/filter-properties";

import { UserStory } from ".";
import { addFilter, clearFilters } from "@/app/_redux/slices/querySlice";
import { FilterCondition } from "@/lib/catalog-interface/helpers/apply-filter";

export const alleleFrequency: UserStory<{
    diseaseId: string;
    propertyPath: string;
    operator: FilterCondition;
    value: number;
}> = {
    slug: "coding-variants-allele-freq",
    title: "Disease allele frequency filtering",
    description: "Filter by a disease's allele frequency so that we can conduct a rare variant analysis.",
    steps: [
        {
            title: "Enter a disease ID.",
            description: "We'll retrieve the genes for this disease. Then, you can view the variants related to these genes. For example, Orphanet_166024.",
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
        const { diseaseId, propertyPath, operator, value } = data;
        dispatch(clearFilters())
        dispatch(addFilter({
            nodeType: "variant",
            condition: operator,
            fieldPath: propertyPath,
            value
        }));

        router.push(`/${diseaseId}`);

        // setTimeout(() => {
        //     const el: HTMLElement | null = document.querySelector("body > div > div > div > div:nth-child(2) > div.pl-4.-mt-4 > div > div > div.border.border-black.rounded-lg.w-fit > table > tbody > tr > td:nth-child(1)");
        //     el?.click();
        // }, 4000);
    },
}
