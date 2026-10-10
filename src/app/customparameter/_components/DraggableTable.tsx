"use client";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Button, Table, TableColumnsType } from "antd";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { HolderOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CSS } from "@dnd-kit/utilities";

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface DataType {
  id: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
  { title: "Name", dataIndex: "name" },
  { title: "Age", dataIndex: "age" },
  { title: "Address", dataIndex: "address" },
];

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

function DraggableTable({ userUrl }: { userUrl: string }) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.id === active?.id,
        );
        const overIndex = prevState.findIndex(
          (record) => record.id === over?.id,
        );
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };
  useEffect(() => {
    fetch(userUrl)
      .then((res) => res.json())
      .then((data) => setDataSource(data.data));
  }, [userUrl]);
  return (
    <DndContext
      id="customparameter"
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={dataSource.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table<DataType>
          rowKey="id"
          components={{ body: { row: Row } }}
          columns={columns}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
  );
}

export default DraggableTable;
