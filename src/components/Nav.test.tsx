import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Nav from './Nav';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Nav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Nav renders no links if links prop is empty', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Nav links={[]} />);

    expect(screen.queryByRole('link')).toBeNull();
  });

  it('Nav renders all provided links', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    const links = [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ];

    render(<Nav links={links} />);

    links.forEach((link) => {
      expect(screen.getByRole('link', { name: link.name })).toBeInTheDocument();
    });
  });

  it('Nav applies active styles when pathname matches a link', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');

    const links = [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
    ];

    render(<Nav links={links} />);

    const activeLink = screen.getByRole('link', { name: 'About' });
    expect(activeLink).toHaveClass('font-bold');
    expect(activeLink).toHaveClass('underline');
    const inactiveLink = screen.getByRole('link', { name: 'Home' });
    expect(inactiveLink).not.toHaveClass('font-bold');
    expect(inactiveLink).not.toHaveClass('underline');
  });
});
