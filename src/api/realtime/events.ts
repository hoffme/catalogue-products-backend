import ProductController from "../../controllers/product";

import {EventClient} from "../../controllers/events";

const events: { [key: string]: EventClient<any> } = {
    'products.create': ProductController.on.create,
    'products.update': ProductController.on.update,
    'products.remove': ProductController.on.delete,
}

export default events;