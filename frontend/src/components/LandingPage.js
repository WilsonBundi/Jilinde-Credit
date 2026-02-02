import { useState, useEffect } from 'react';

const LandingPage = ({ navigate }) => {
  const [currentTeamMember, setCurrentTeamMember] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showFullView, setShowFullView] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Team members data
  const teamMembers = [
    {
      name: 'Samuel Eringo',
      position: 'Chief Executive Officer',
      photo: (
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid white',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          fontSize: '4rem',
          color: 'white',
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
          animation: 'avatarGlow 3s ease-in-out infinite, breathe 4s ease-in-out infinite'
        }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '60%',
            height: '60%',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'shimmer 3s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '20%',
            height: '20%',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          SE
        </div>
      ),
      photoFallback: '👨‍💼',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundImage: null, // No photo available
      description: 'Visionary leader with extensive experience in microfinance and financial inclusion across East Africa.'
    },
    {
      name: 'Henry Mutuma',
      position: 'Credit Manager',
      photo: (
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid white',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          fontSize: '4rem',
          color: 'white',
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
          animation: 'avatarGlow 3s ease-in-out infinite 0.5s, breathe 4s ease-in-out infinite 0.5s'
        }}>
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '15%',
            width: '30%',
            height: '30%',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite 0.5s'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '25%',
            height: '25%',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'shimmer 3s ease-in-out infinite 1s'
          }} />
          HM
        </div>
      ),
      photoFallback: '👨‍💻',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      backgroundImage: '/images/henry-mutuma.jpg',
      description: 'Expert in credit assessment, risk management, and loan portfolio optimization with focus on financial inclusion.'
    },
    {
      name: 'Wilson Bundi',
      position: 'Lead Developer',
      photo: (
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid white',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          fontSize: '4rem',
          color: 'white',
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
          animation: 'avatarGlow 3s ease-in-out infinite 1s, breathe 4s ease-in-out infinite 1s'
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '25%',
            height: '25%',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            animation: 'pulse 2.5s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '15%',
            width: '25%',
            height: '25%',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            animation: 'pulse 2.5s ease-in-out infinite 0.3s'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            height: '15%',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50px',
            animation: 'shimmer 4s ease-in-out infinite'
          }} />
          WB
        </div>
      ),
      photoFallback: '👨‍💻',
      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
      backgroundImage: '/images/wilson-bundi.jpg',
      description: 'Full-stack developer specialized in building scalable financial technology solutions and user experiences.'
    }
  ];

  // Animation trigger
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Auto-rotate team members
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTeamMember(prev => (prev + 1) % teamMembers.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [teamMembers.length]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.3) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite'
      }} />

      {/* Navigation Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
          }}>
            🏦
          </div>
          <div>
            <h2 style={{ 
              margin: 0, 
              color: 'white', 
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              Jilinde Credit Limited
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '0.9rem' 
            }}>
              Licensed Microfinance Institution
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => navigate('/customer')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            👤 Customer Portal
          </button>
          {/* Admin Portal - Hidden from public, accessible via direct URL /admin */}
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '80px 40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease'
        }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '900',
            margin: '0 0 20px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            The Future of
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Microfinance
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            marginBottom: '50px',
            opacity: 0.9,
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 50px auto'
          }}>
            Providing accessible microfinance solutions with advanced digital technology, 
            comprehensive security protocols, and biometric verification systems. 
            Serving over 50,000 registered clients across Kenya.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '25px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '80px'
          }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '20px 40px',
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              📋 Submit Loan Application
            </button>

            <button
              onClick={() => navigate('/customer')}
              style={{
                padding: '20px 40px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease'
              }}
            >
              👤 Client Portal Access
            </button>
          </div>

          {/* Stats Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { number: '50K+', label: 'Registered Clients', icon: '👥' },
              { number: 'KES 5B+', label: 'Total Disbursements', icon: '💰' },
              { number: '98%', label: 'Client Satisfaction', icon: '✅' },
              { number: '24/7', label: 'Support Available', icon: '⚡' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '30px 20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '100px 40px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '30px',
            color: 'white'
          }}>
            About Jilinde Credit Limited
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
              <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.5rem' }}>Our Mission</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6', margin: 0 }}>
                To provide accessible, innovative, and responsible microfinance solutions that empower individuals 
                and small businesses across Kenya to achieve financial independence and economic growth through 
                cutting-edge technology and personalized service.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔮</div>
              <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.5rem' }}>Our Vision</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6', margin: 0 }}>
                To be East Africa's leading digital microfinance institution, recognized for innovation, 
                transparency, and impact in financial inclusion. We envision a future where every individual 
                has access to fair and sustainable financial services.
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'left'
          }}>
            <h3 style={{ color: 'white', marginBottom: '30px', fontSize: '1.8rem', textAlign: 'center' }}>
              🏆 Our Values & Commitment
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              {[
                { icon: '🤝', title: 'Integrity', desc: 'Transparent and ethical practices in all our operations' },
                { icon: '🚀', title: 'Innovation', desc: 'Leveraging technology to improve financial accessibility' },
                { icon: '💡', title: 'Excellence', desc: 'Delivering superior service and customer satisfaction' },
                { icon: '🌍', title: 'Impact', desc: 'Creating positive change in communities we serve' }
              ].map((value, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{value.icon}</div>
                  <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '1.2rem' }}>{value.title}</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '0.9rem' }}>
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section with Animated Photos */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '100px 40px',
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white'
          }}>
            Meet Our Leadership Team
          </h2>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '60px',
            opacity: 0.8,
            color: 'white'
          }}>
            Experienced professionals dedicated to transforming microfinance in Kenya
          </p>

          {/* Animated Team Member Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '60px'
          }}>
            <div 
              onClick={() => {
                setSelectedMember(teamMembers[currentTeamMember]);
                setShowFullView(true);
              }}
              style={{
              background: teamMembers[currentTeamMember].backgroundImage 
                ? `url('${teamMembers[currentTeamMember].backgroundImage}')`
                : teamMembers[currentTeamMember].background,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
              height: '500px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.8s ease',
              transform: 'scale(1.02)',
              animation: 'teamMemberPulse 4s ease-in-out infinite',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden'
            }}>
              {/* Small Badge in Corner */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: teamMembers[currentTeamMember].background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                {teamMembers[currentTeamMember].name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Information at Bottom */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
                padding: '40px 20px 20px 20px'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                }}>
                  {teamMembers[currentTeamMember].name}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '1.2rem',
                  marginBottom: '0',
                  fontWeight: '600',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
                }}>
                  {teamMembers[currentTeamMember].position}
                </p>
              </div>

              {/* Click to View Indicator */}
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
                Click to view
              </div>
            </div>
          </div>

          {/* Team Navigation Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '40px'
          }}>
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTeamMember(index)}
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentTeamMember === index 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: currentTeamMember === index ? 'scale(1.3)' : 'scale(1)'
                }}
              />
            ))}
          </div>

          {/* Team Grid Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentTeamMember(index);
                  setSelectedMember(member);
                  setShowFullView(true);
                }}
                style={{
                  background: member.backgroundImage 
                    ? `url('${member.backgroundImage}')`
                    : 'rgba(255, 255, 255, 0.1)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  backdropFilter: 'blur(20px)',
                  padding: '15px',
                  border: currentTeamMember === index 
                    ? '2px solid rgba(255, 255, 255, 0.8)' 
                    : 'none',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: currentTeamMember === index ? 'scale(1.05)' : 'scale(1)',
                  height: '200px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Small Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  background: member.background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Information at Bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
                  padding: '25px 10px 10px 10px'
                }}>
                  <h4 style={{ 
                    color: 'white', 
                    margin: '0 0 3px 0', 
                    fontSize: '0.9rem',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                  }}>
                    {member.name}
                  </h4>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    margin: 0, 
                    fontSize: '0.7rem',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                  }}>
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '100px 40px',
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(46, 125, 50, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white'
          }}>
            Get In Touch
          </h2>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '60px',
            opacity: 0.8,
            color: 'white'
          }}>
            Ready to start your financial journey? Contact us today for personalized microfinance solutions.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Head Office */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏢</div>
              <h3 style={{ color: 'white', marginBottom: '20px' }}>Head Office</h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
                <p style={{ margin: '10px 0' }}>📍 Jilinde Credit Tower</p>
                <p style={{ margin: '10px 0' }}>Kimathi Street, Nairobi CBD</p>
                <p style={{ margin: '10px 0' }}>P.O. Box 12345-00100</p>
                <p style={{ margin: '10px 0' }}>Nairobi, Kenya</p>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📞</div>
              <h3 style={{ color: 'white', marginBottom: '20px' }}>Contact Information</h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
                <p style={{ margin: '10px 0' }}>
                  📱 <a 
                    href="https://wa.me/254719696631" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'white', 
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderBottom = '2px solid #25D366';
                      e.target.style.color = '#25D366';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderBottom = '1px solid rgba(255, 255, 255, 0.5)';
                      e.target.style.color = 'white';
                    }}
                  >
                    +254719696631
                  </a> 
                  <span style={{ 
                    marginLeft: '10px', 
                    fontSize: '0.9rem', 
                    color: 'rgba(255, 255, 255, 0.7)' 
                  }}>
                    (WhatsApp Available)
                  </span>
                </p>
                <p style={{ margin: '10px 0' }}>☎️ +254719696631</p>
                <p style={{ margin: '10px 0' }}>📧 info@jilindecredit.co.ke</p>
                <p style={{ margin: '10px 0' }}>🌐 www.jilindecredit.co.ke</p>
              </div>
            </div>

            {/* Business Hours */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🕒</div>
              <h3 style={{ color: 'white', marginBottom: '20px' }}>Business Hours</h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
                <p style={{ margin: '10px 0' }}>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p style={{ margin: '10px 0' }}>Saturday: 9:00 AM - 2:00 PM</p>
                <p style={{ margin: '10px 0' }}>Sunday: Closed</p>
                <p style={{ margin: '10px 0', color: '#4caf50', fontWeight: 'bold' }}>
                  24/7 Online Services Available
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Actions */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => window.open('tel:+254719696631')}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              📞 Call Us Now
            </button>

            <button
              onClick={() => window.open('https://wa.me/254719696631?text=Hello%20Jilinde%20Credit!%20I%20would%20like%20to%20inquire%20about%20your%20microfinance%20services.', '_blank')}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              💬 WhatsApp Us
            </button>

            <button
              onClick={() => window.open('mailto:info@jilindecredit.co.ke')}
              style={{
                padding: '15px 30px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              📧 Send Email
            </button>

            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              🚀 Apply Online
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '60px 40px 40px 40px',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginRight: '15px'
            }}>
              🏦
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                Jilinde Credit Limited
              </h3>
              <p style={{ 
                margin: 0, 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '0.9rem' 
              }}>
                Professional Microfinance Services
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://wa.me/254719696631" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#25D366';
              }}
              onMouseOut={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              📞 +254719696631 (WhatsApp)
            </a>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>📧 info@jilindecredit.co.ke</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>📍 Nairobi, Kenya</span>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '30px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.9rem'
          }}>
            © 2024 Jilinde Credit Limited. All rights reserved. | Licensed Microfinance Institution - Central Bank of Kenya
          </div>
        </div>
      </div>

      {/* Full View Modal */}
      {showFullView && selectedMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: selectedMember.backgroundImage 
            ? 'rgba(0, 0, 0, 0.9)'
            : 'rgba(0, 0, 0, 0.95)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: selectedMember.backgroundImage 
              ? `url('${selectedMember.backgroundImage}')`
              : selectedMember.background,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            maxWidth: '600px',
            width: '100%',
            height: '90vh',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowFullView(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* Badge */}
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: selectedMember.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              {selectedMember.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Full Information */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.95))',
              padding: '80px 30px 30px 30px'
            }}>
              <h2 style={{
                color: 'white',
                fontSize: '2.5rem',
                marginBottom: '10px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
              }}>
                {selectedMember.name}
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '1.5rem',
                marginBottom: '20px',
                fontWeight: '600',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
              }}>
                {selectedMember.position}
              </p>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                margin: 0,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
              }}>
                {selectedMember.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes teamMemberPulse {
          0%, 100% { transform: scale(1.02); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4); }
        }
        
        @keyframes photoRotate {
          0%, 100% { transform: rotateY(0deg) scale(1); }
          25% { transform: rotateY(90deg) scale(1.1); }
          50% { transform: rotateY(180deg) scale(1.2); }
          75% { transform: rotateY(270deg) scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        
        @keyframes avatarGlow {
          0%, 100% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 12px 48px rgba(76, 175, 80, 0.4), 0 0 30px rgba(255, 255, 255, 0.2); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;