
export function VariantAnnotation({ annotations }: { annotations: any }) {

    return (
        <table className="table-auto">
            <tbody>
                {annotations.varinfo && (
                    <tr>
                        <td>SPDI:</td>
                        <td>{annotations.varinfo}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
