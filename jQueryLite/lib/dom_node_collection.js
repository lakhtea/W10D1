class DomNodeCollection {
  constructor(nodes) {
    // The nodes passed in must always be an Array. NodeList has no
    // #forEach method, so we need to be able to count on the type of
    // `nodes` so that we can prevent TypeErrors later on. We therefore
    // must ensure we only pass the `DomNodeCollection` constructor
    // Arrays in our core function.
    this.nodes = nodes;
  }

  each(cb) {
    // Our each passes in the node and index in traditional 'forEach' order,
    // jquery passes in index first and binds the call to the element.
    this.nodes.forEach(cb);
  }

  remove() {
    this.each((node) => node.parentNode.removeChild(node));
  }

  attr(key, val) {
    if (typeof val === "string") {
      this.each((node) => node.setAttribute(key, val));
    } else {
      return this.nodes[0].getAttribute(key);
    }
  }

  addClass(newClass) {
    this.each((node) => node.classList.add(newClass));
  }

  removeClass(oldClass) {
    this.each((node) => node.classList.remove(oldClass));
  }

  toggleClass(toggleClass) {
    this.each((node) => node.classList.toggle(toggleClass));
  }

  find(selector) {
    let foundNodes = [];
    this.each((node) => {
      const nodeList = node.querySelectorAll(selector);
      foundNodes = foundNodes.concat(Array.from(nodeList));
    });
    return new DomNodeCollection(foundNodes);
  }

  children() {
    let childNodes = [];
    this.each((node) => {
      const childNodeList = node.children;
      childNodes = childNodes.concat(Array.from(childNodeList));
    });
    return new DomNodeCollection(childNodes);
  }

  parent() {
    const parentNodes = [];
    this.each(({ parentNode }) => {
      // we apply 'visited' property to prevent adding duplicate parents
      if (!parentNode.visited) {
        parentNodes.push(parentNode);
        parentNode.visited = true;
      }
    });

    parentNodes.forEach((node) => {
      node.visited = false;
    });
    return new DomNodeCollection(parentNodes);
  }
}

module.exports = DomNodeCollection;
