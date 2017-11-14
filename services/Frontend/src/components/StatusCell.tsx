// import * as React from 'react';
// var PropTypes = require('prop-types');
// import { TableCell } from 'material-ui';
// import { withStyles } from 'material-ui/styles';

// // const styles = theme => ({
// //   highlightedCell: {
// //     paddingLeft: theme.spacing.unit,
// //     paddingRight: theme.spacing.unit,
// //     borderBottom: `1px solid ${theme.palette.text.lightDivider}`,
// //   },
// // });

// const StatusCell = ({
//   align, value, classes, style,
// }) => (
//   <TableCell
//     className={classes.highlightedCell}
//     style={{
//       color: getColor(value),
//       textAlign: align,
//       ...style,
//     }}
//   >
//     ${value}
//   </TableCell>
// );

// HighlightedCellBase.propTypes = {
//   value: PropTypes.number.isRequired,
//   classes: PropTypes.object.isRequired,
//   align: PropTypes.string.isRequired,
//   style: PropTypes.object,
// };
// HighlightedCellBase.defaultProps = {
//   style: {},
// };

// export const StatusCell = withStyles(styles, { name: 'HighlightedCell' })(HighlightedCellBase);