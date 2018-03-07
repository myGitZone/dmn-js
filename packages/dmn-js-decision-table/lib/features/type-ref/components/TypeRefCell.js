import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


export default class TypeRefCell extends Component {

  constructor(props) {
    super(props);
  }

  onClick = (event) => {

    const element = this.getTypeRefTarget();

    this._eventBus.fire('typeRef.edit', {
      event,
      element
    });
  }

  onContextmenu = (event) => {

    const { element } = this.props;

    this._eventBus.fire('cell.contextmenu', {
      event,
      node: event.node,
      id: element.id
    });
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    this._changeSupport = this.context.changeSupport;
    this._sheet = injector.get('sheet');
    this._eventBus = injector.get('eventBus');

    const target = this.getTypeRefTarget();

    this._changeSupport.onElementsChanged(target.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const target = this.getTypeRefTarget();

    this._changeSupport.offElementsChanged(target.id, this.onElementsChanged);
  }

  getTypeRefTarget() {

    const {
      element
    } = this.props;

    return is(element, 'dmn:InputClause') ? element.inputExpression : element;
  }

  render() {
    const {
      element,
      className
    } = this.props;

    const actualClassName = (className || '') + ' type-ref';

    const colId = is(element, 'dmn:LiteralExpression')
      ? element.$parent.id
      : element.id;

    return (
      <th
        className={ actualClassName }
        data-col-id={ colId }
        onClick={ this.onClick }
        onContextmenu={ this.onContextmenu }>
        { element.typeRef }
      </th>
    );
  }

}