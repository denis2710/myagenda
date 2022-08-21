import {getGraphQLParameters, processRequest, renderGraphiQL, sendResult, shouldRenderGraphiQL} from "graphql-helix";
import createSchema from "./schema";

async  function graphQLRoute  (req, res) {

    const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
    }

    const schema = await createSchema()

    if(shouldRenderGraphiQL(request)) {
        res.send(renderGraphiQL())
    } else {
        const { operationName, query, variables } = getGraphQLParameters(request);

        //valida e execulta a query
        const result = await processRequest({
            operationName,
            query,
            variables,
            request,
            schema
        });

        await sendResult(result, res);
    }

}
export default graphQLRoute;