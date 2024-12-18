import {useState} from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react';
const math = require('mathjs');

export default function Tree({pos, coords, id, assets, fname}) {
  const treeHalfSize = [50, 50];
  const treePos = math.subtract(pos, coords);


  const [isOpen, setIsOpen] = useState(false);

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {move: false});
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: 'label',
  });
  // Merge all the interactions into prop getters
  const {getReferenceProps, getFloatingProps} = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <div className="tree" style={{'--treePosX': treePos[0] + 'px', '--treePosY': treePos[1] + 'px'}}>
     <button ref={refs.setReference} {...getReferenceProps()}>
      <img src={assets[fname + id % 8 + '.png']} />
     </button>

     { isOpen && (
       <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="tooltip__tree"
        >
         {fname}: id: {id}, (x: {pos[0]}, y: {pos[1]})
        </div>
        )}

    </div>
  );
}
