interface RowCellProps {
  label: string,
  value: string,
}

export const RowCell = (props: RowCellProps) => {
  return (
    <div className='box-content w-full h-20 py-10 pl-10 flex items-center border-b border-solid border-zinc-100'>
      <div className="w-96 h-20">{props.label}：</div>
      <div className='flex-1 h-20'>{props.value}</div>
    </div>
  )
}
