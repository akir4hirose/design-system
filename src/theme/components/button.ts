const disabledBackgroundColor = 'blueGray.200';

export const Button = {
  baseStyle: {
    borderRadius: 'base',
    _disabled: {
      opacity: 'unset',
      backgroundColor: disabledBackgroundColor,
      color: 'white',
    },
    _hover: { _disabled: { backgroundColor: disabledBackgroundColor } },
  },
  sizes: {
    xs:{ fontSize:'sm' }, sm:{ fontSize:'md' },
    md:{ fontSize:'lg' }, lg:{ fontSize:'xl' },
  },
  variants: {
    outline: {
      _disabled: {
        color:'blueGray.300', backgroundColor:'white', borderColor:'blueGray.300',
      },
      _hover: { _disabled: { backgroundColor:'white' } },
    },
  },
};
