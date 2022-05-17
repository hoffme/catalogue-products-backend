import ProductController from "../../controllers/product";

import {EventClient} from "../../controllers/events";

const events: { [key: string]: EventClient<any> } = {
    'product.create': ProductController.on.create,
    'product.update': ProductController.on.update,
    'product.delete': ProductController.on.delete,
}

export default events;