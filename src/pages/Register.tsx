import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/services/api';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Register = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await auth.register({
        name,
        email,
        password,
        role: role as 'farmer' | 'buyer',
        location,
        phone,
      });
      toast({
        title: 'Success',
        description: 'Account created successfully. Please login to continue.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    return role === 'farmer' ? 'Join as a Farmer' : 'Create an Account';
  };

  const getDescription = () => {
    return role === 'farmer'
      ? 'Join our community of farmers and start selling your products directly to customers'
      : 'Create an account to start shopping for fresh, organic produce';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gradient-to-br from-organic-cream via-white to-accent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {getTitle()}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getDescription()}
            </p>
          </div>
        </div>
        
        <section className="py-20">
          <div className="max-w-md mx-auto px-4">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-900">
                  {getTitle()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-organic-green hover:bg-organic-green-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  <div className="text-center mt-4">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <Button
                        variant="link"
                        className="text-organic-green hover:text-organic-green-dark p-0"
                        onClick={() => navigate('/login')}
                      >
                        Login here
                      </Button>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Register; 