import * as React from "react";
import * as ReactDOM from "react-dom";
import { 
    DragDropContext, 
    Droppable, 
    Draggable, 
    DropResult, 
    ResponderProvided, 
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided, 
    DraggableStateSnapshot 
} from "react-beautiful-dnd";

export type DropResult = DropResult;
export type ResponderProvided = ResponderProvided;

export interface VerticalDnDPRops<T>
{
    onDragEnd : (result : DropResult,provided : ResponderProvided) => void;
    droppableID : string;
    draggableKey : (el : T) => string;
    draggableId : (el : T) => string;
    draggableContent : (el : T) => JSX.Element;
    portal : HTMLElement;
    data : Array<T>;
}

export function VerticalDnD<T>(props : VerticalDnDPRops<T>) : JSX.Element
{
    return (
        <DragDropContext onDragEnd={props.onDragEnd}>
            <Droppable droppableId={props.droppableID}>
                {(provided : DroppableProvided,snapshot : DroppableStateSnapshot) => 
                {
                    return (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {props.data.map((el : T,i : number) => 
                            {
                                return (
                                    <Draggable 
                                        key={props.draggableKey(el)} 
                                        draggableId={props.draggableId(el)}
                                        index={i}
                                    >
                                        {(provided : DraggableProvided,snapshot : DraggableStateSnapshot) => 
                                        {
                                            const node : JSX.Element = (
                                                <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {props.draggableContent(el)}
                                                </div>
                                            );

                                            if(snapshot.isDragging)
                                                return ReactDOM.createPortal(node,props.portal);
                                            
                                            return node;
                                        }}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    );
                }}
            </Droppable>
        </DragDropContext>
    );
}
