export const CustomBlock = (props: any) => {
  return (
    <div className='w-full rounded-3xl overflow-hidden bg-[#F0F0FA]'>
      <div className='py-10 pl-10'>{props.title}</div>
      <div className='border-r-0 border-l-0 bg-white'>
        {props.children}
      </div>
    </div>
  )
}
