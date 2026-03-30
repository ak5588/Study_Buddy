import PropTypes from 'prop-types';

const ScrollArea = ({ className, children }) => (
  <div className={`overflow-y-auto ${className}`}>
    {children}
  </div>
);

ScrollArea.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export { ScrollArea };